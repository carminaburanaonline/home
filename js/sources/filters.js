// SCripts for filters on the table of sources

function normalize(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getFilters() {
  return {
    rism: normalize(document.getElementById('filter-rism').value),
    country: normalize(document.getElementById('filter-country').value),
    city: normalize(document.getElementById('filter-city').value),
    library: normalize(document.getElementById('filter-library').value)
  };
}


export function filterSources(sources, filters) {
  return sources.filter(s => {

    if (filters.rism && !normalize(s.rism).includes(filters.rism)) {
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
