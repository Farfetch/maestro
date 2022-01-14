export const timeFormat = {
  millisecond: "HH:mm",
  second: "HH:mm",
  minute: "HH:mm",
  hour: "HH:mm",
  day: "HH:mm",
  week: "HH:mm",
  month: "HH:mm",
  quarter: "HH:mm",
  year: "HH:mm"
};

export const defaultChartOptions = (
  minDatetime = null,
  maxDatetime = null
) => ({
  scales: {
    x: {
      type: "time",
      time: {
        unit: "minute",
        displayFormats: timeFormat
      },
      min: minDatetime,
      max: maxDatetime
    }
  },
  animation: {
    duration: 0
  }
});
