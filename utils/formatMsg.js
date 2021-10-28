const moment = require("moment");

const formatMsg = (username, msg, id) => {
  return {
    username: username,
    msg: msg,
    id: id,
    time: moment.utc().local().format("h:mm a"),
  };
};

module.exports = formatMsg;
