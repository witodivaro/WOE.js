function getNumberWithCommas(number) {
  const stringifiedNumber = String(number);
  const stringifiedNumberDigits = stringifiedNumber.split("");

  return stringifiedNumberDigits
    .reverse()
    .map((el, index) => (index && index % 3 === 0 ? `${el},` : el))
    .reverse()
    .join("");
}

module.exports = {
  getNumberWithCommas,
};
