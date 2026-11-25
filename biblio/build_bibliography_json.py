import json, re, unicodedata, html as htmlmod
from pathlib import Path
from bs4 import BeautifulSoup
from difflib import SequenceMatcher

BASE=Path('/mnt/data')
FILES={'en':BASE/'biblio_en_chi2.html','fr':BASE/'biblio_fr.html'}
STOP={
 'a','an','the','of','on','in','to','for','and','or','at','from','by','with','as',
 'le','la','les','un','une','des','du','de','d','dans','sur','et','ou','au','aux','par','pour','avec',
 'der','die','das','den','dem','des','ein','eine','einer','eines','und','oder','von','vom','im','in','zu','zur','zum',
 'il','lo','i','gli','un','una','di','del','della','e','en','el','los','las','y'
}

def plain(s):
 return ' '.join(s.get_text(' ',strip=True).replace('\xa0',' ').split())

def norm(s):
 s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
 return re.sub(r'[^a-z0-9]+',' ',s).strip()

def years(text):
 # Includes year ranges such as 1907-1909; first year is used for sorting/IDs.
 return re.findall(r'(?<!\d)(1[0-9]{3}|20[0-9]{2})(?!\d)',text)

def title_en(e):
 text=plain(e)
 m=re.search(r'[“\"]([^”\"]+)[”\"]',text)
 if m: return m.group(1).strip()
 it=e.find('i')
 return plain(it) if it else text

def title_fr(e):
 text=plain(e)
 m=re.search(r'«\s*([^»]+?)\s*»',text)
 if m: return m.group(1).strip()
 it=e.find('i')
 return plain(it) if it else text

def first_author_en(e):
 text=plain(e)
 before=re.split(r'[.,]',text,1)[0].strip()
 return before or 'Unknown'

def first_author_fr(e,last):
 sc=e.find('span',style=lambda v:v and 'small-caps' in v)
 if sc: return plain(sc)
 text=plain(e)
 if text.startswith(('─','—','–')): return last
 return re.split(r'[.,]',text,1)[0].strip() or last or 'Unknown'

def explicit_french_html(e, full_author):
 raw=inner_html(e)
 # Replace only a repeat-author mark at the beginning of the entry. Dashes
 # elsewhere, including page and year ranges, are preserved.
 return re.sub(r'^\s*[─—–]\s*(?=,)', htmlmod.escape(full_author), raw, count=1)

def inner_html(e):
 return ''.join(str(x) for x in e.contents).strip()

def load(lang):
 soup=BeautifulSoup(FILES[lang].read_text(encoding='utf-8-sig'),'html.parser')
 out=[]; last=''; last_full_author=''
 for i,e in enumerate(soup.select('div.csl-entry')):
  text=plain(e); ys=years(text); year=ys[0] if ys else ''
  if lang=='en':
   author=first_author_en(e); title=title_en(e); rendered_html=inner_html(e)
  else:
   repeated=text.startswith(('─','—','–'))
   author=first_author_fr(e,last)
   title=title_fr(e)
   if repeated:
    full_author=last_full_author or author
   else:
    pos=text.find(title)
    prefix=text[:pos] if pos >= 0 else author
    full_author=prefix.rstrip(' ,«\u00a0').strip() or author
    last_full_author=full_author
   if author!='Unknown': last=author
   rendered_html=explicit_french_html(e,full_author)
  out.append({'index':i,'author':author,'year':year,'title':title,'text':text,'html':rendered_html})
 return out

en,fr=load('en'),load('fr')
# Match same-year records by title similarity. Exact normalized-title matches are preferred.
unused=set(range(len(fr))); pairs=[]
by_year={}
for j,x in enumerate(fr): by_year.setdefault(x['year'],[]).append(j)
for a in en:
 candidates=[j for j in by_year.get(a['year'],[]) if j in unused]
 nt=norm(a['title'])
 exact=[j for j in candidates if norm(fr[j]['title'])==nt]
 if exact:
  j=exact[0]; score=1.0
 else:
  # Fuzzy title matching is constrained by first author, preventing
  # unrelated same-year records from being paired.
  same_author=[j for j in candidates if norm(fr[j]['author'])==norm(a['author'])]
  scored=[(SequenceMatcher(None,nt,norm(fr[j]['title'])).ratio(),j) for j in same_author]
  score,j=max(scored,default=(0,None))
  # fallback for a missing/misread year, still constrained by author
  if j is None or score<0.72:
   author_pool=[k for k in unused if norm(fr[k]['author'])==norm(a['author'])]
   scored=[(SequenceMatcher(None,nt,norm(fr[k]['title'])).ratio(),k) for k in author_pool]
   score,j=max(scored,default=(0,None))
 if j is None or score<0.72:
  pairs.append((a,None,score))
 else:
  unused.remove(j); pairs.append((a,fr[j],score))

# Add French-only records rather than silently dropping source material.
for j in sorted(unused): pairs.append((None,fr[j],0.0))

def meaningful(title):
 words=re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ0-9]+",title)
 for w in words:
  if norm(w) not in STOP and len(norm(w))>1: return w
 return words[0] if words else 'entry'

def idpart(s, fallback='Unknown'):
 # ASCII letters and digits only: no separators in IDs. Preserve word boundaries
 # through capitalization, e.g. 'de Riquer' -> 'DeRiquer'.
 raw=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode()
 parts=re.findall(r'[A-Za-z0-9]+',raw)
 return ''.join(p[:1].upper()+p[1:] for p in parts) or fallback

ids=set(); data=[]
for a,b,score in pairs:
 src=a or b
 author=(a or b)['author']; year=(a or b)['year']; title=(a or b)['title']
 base=f"{idpart(author)}{year or 'ND'}{idpart(meaningful(title))}"
 ident=base; n=2
 while ident in ids:
  ident=f'{base}{n}'; n+=1
 ids.add(ident)
 en_html=a['html'] if a else ''
 fr_html=b['html'] if b else ''
 formatted=f"<div data-lang='en'>{en_html}</div><div data-lang='fr'>{fr_html}</div>"
 data.append({'id':ident,'formattedHTML':formatted,'sortAuthor':author,'sortYear':year})

out=BASE/'bibliography_bilingual.json'
out.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
report={
 'english_entries':len(en),'french_entries':len(fr),'json_entries':len(data),
 'matched_pairs':sum(1 for a,b,s in pairs if a and b),
 'english_only':sum(1 for a,b,s in pairs if a and not b),
 'french_only':sum(1 for a,b,s in pairs if b and not a),
 'low_similarity_matches':[
  {'en':a['text'][:160],'fr':b['text'][:160],'score':round(s,3)}
  for a,b,s in pairs if a and b and s<0.82
 ]
}
(BASE/'bibliography_build_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
