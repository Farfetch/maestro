import moment from "moment";

const loadProfileToTimeframe = (firstDatetime, loadProfile) => {
  const getTime = (datetime) =>
    moment.utc(datetime.diff(firstDatetime)).format("mm:ss");

  const createTimeframeReducer = (previous, { start, end, duration }) => {
    const lastDatetime = moment(
      previous.length > 0
        ? previous[previous.length - 1].datetime
        : firstDatetime
    );

    previous.push({
      rps: start,
      datetime: lastDatetime,
      time: previous.length === 0 ? 0 : getTime(lastDatetime)
    });

    const endDatetime = moment(lastDatetime).add(duration, "seconds");

    previous.push({
      rps: end,
      datetime: endDatetime,
      time: getTime(endDatetime)
    });

    return previous;
  };

  const loadProfileTimeframe = loadProfile.reduce(createTimeframeReducer, []);

  return loadProfileTimeframe;
};

export default loadProfileToTimeframe;
