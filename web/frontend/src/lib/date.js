import moment from "moment";

const defaultDatetimeFormat = "YYYY-MM-DD HH:mm:ss";

const hourMinuteFormat = "HH:mm";

export const toUtcString = (localDatetime) =>
  localDatetime.utc().format(defaultDatetimeFormat);

export const toLocalDate = (utcDatetimeStr) =>
  moment.utc(utcDatetimeStr).local();

export const toUtcHourMinute = (localDatetime) =>
  localDatetime.utc().format(hourMinuteFormat);

export const toLocalHourMinute = (utcHourMinute) =>
  moment.utc(utcHourMinute, hourMinuteFormat).local();
