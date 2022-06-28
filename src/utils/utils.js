const moment = require("moment");
const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment(new Date()).format("LT"),
  };
};

const generateGeolocation = (from, lat, long) => {
  return {
    from,
    url: `https://google.com/maps?q=${lat},${long}`,
    createdAt: moment(new Date()).format("LT"),
  };
};

module.exports = {
  generateMessage,
  generateGeolocation,
};
