export const isSmallScreen = width => width < 768;

export const filterSuggestion = (suggestions, value) => {
  if (value.length < 1) return [];
  return suggestions.filter(
    item => item.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
  );
};
