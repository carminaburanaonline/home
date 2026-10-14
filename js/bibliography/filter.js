// Scripts for filter on the bibliography

function normalize(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterBibliography(entries, query) {
  return entries.filter(b => {

    if (!normalize(s.rism).includes(filters.rism)) {
      return false;
    }

    if (filters.country && !normalize(s.country).includes(filters.country)) {
      return false;
    }

    if (filters.city && !normalize(s.city).includes(filters.city)) {
      return false;
    }

    if (filters.library && !normalize(s.library).includes(filters.library)) {
      return false;
    }

    return true;
  });
}