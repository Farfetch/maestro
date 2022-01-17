import moment from "moment";
import { useEffect, useState } from "react";

const Timer = ({
  children,
  startTime,
  updateInterval = 1000,
  format = "HH:mm:ss",
  defaultTime = "00:00:00"
}) => {
  const [time, setTime] = useState(defaultTime);
  const [loading, setLoading] = useState(true);

  const updateTime = (startTimeToLoad, formatToLoad) => {
    const now = moment();

    const duration = moment.utc(now.diff(startTimeToLoad)).format(formatToLoad);
    setTime(duration);
    setLoading(false);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      updateTime(startTime, format);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [startTime, format, updateInterval]);

  useEffect(() => {
    updateTime(startTime, format);
  }, [startTime, format]);

  return children(time, loading);
};

export default Timer;
