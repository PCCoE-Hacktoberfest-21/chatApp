const moment = require("moment");

const formatMsg = (username, msg) => {
  return {
    username: username,
    msg: msg,
    time: moment.utc().local().format("h:mm a"),
  };
};

module.exports = formatMsg;
