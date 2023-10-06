export const avg = (value, itemsCount) =>
  itemsCount === 0 ? 0 : value / itemsCount;

export const calculateErrorRate = (successCount, totalCount) => {
  const errorRate = parseFloat((1 - successCount / totalCount) * 100).toFixed(
    2
  );

  return errorRate === "NaN" ? 0 : errorRate;
};
