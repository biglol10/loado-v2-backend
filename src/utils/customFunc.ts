const extractNumber = (string: string) => {
  const numberRegex = /\d+/;
  const match = string.match(numberRegex);
  return match ? parseInt(match[0]) : null;
};

export { extractNumber };
