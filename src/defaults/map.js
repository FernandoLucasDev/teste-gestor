export const mapDropdownSearch = (map, needle) => {
  let selected;
  map.map((entry) => {
    if (entry.value == needle) {
      selected = entry;
    }
  });

  return selected;
}