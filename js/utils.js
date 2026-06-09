export function linkify(text) {
  if (!text) return '';

  const urlPattern = /(https?:\/\/[^\s,)]+)/g;

  return text.replace(urlPattern, url => {
    const display = url.replace(/^https?:\/\//, '');

    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
  });
}