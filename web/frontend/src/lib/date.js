import moment from "moment";

const defaultDatetimeFormat = "YYYY-MM-DD HH:mm:ss";

export const toUtcString = (localDatetime) =>
  localDatetime.utc().format(defaultDatetimeFormat);

export const toLocalDate = (utcDatetimeStr) =>
  moment.utc(utcDatetimeStr).local();

export default { toUtcString };
