const isRealString = (string) => {
  let valid = true;
  if (string.trim().length === 0 || string.trim() === "") {
    valid = false;
  }
  return valid;
};

module.exports = { isRealString };
