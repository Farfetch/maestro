import moment from "moment";

import loadProfileToTimeframe from "../loadProfileToTimeframe";

describe("lib/charts/datasets", () => {
  describe("loadProfileToTimeframe", () => {
    test("should return list of custom data elements", async () => {
      const loadProfileData = [
        {
          start: 1,
          end: 2,
          duration: 10
        }
      ];

      const firstDatetime = moment.utc().milliseconds(0);

      const dataTorender = loadProfileToTimeframe(
        firstDatetime,
        loadProfileData
      );

      expect(dataTorender).toStrictEqual([
        {
          rps: 1,
          time: 0,
          datetime: moment(firstDatetime)
        },
        {
          rps: 2,
          time: "00:10",
          datetime: moment(firstDatetime).add(10, "seconds")
        }
      ]);
    });
  });
});
