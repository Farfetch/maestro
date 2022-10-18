import { toLocalDate } from "../../../date";
import metricsToResponseCodeLinesDataset from "../metricsToResponseCodeLine";

const metrics = [
  {
    minDatetime: toLocalDate("2022-01-13T15:37:38.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:37:44.000Z"),
    latencyAvg: 25.1,
    latencyP99: 46.72,
    latencyP95: 45.38,
    latencyP90: 42.91,
    latencyP50: 25.16,
    successCount: 147.6,
    totalCount: 147.6,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 147.6,
        totalCount: 147.6
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:37:45.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:37:59.000Z"),
    latencyAvg: 25.19,
    latencyP99: 47.04,
    latencyP95: 45.64,
    latencyP90: 43.41,
    latencyP50: 25.42,
    successCount: 359.7,
    totalCount: 359.7,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 359.7,
        totalCount: 359.7
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:38:00.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:38:14.000Z"),
    latencyAvg: 24.92,
    latencyP99: 46.88,
    latencyP95: 45.51,
    latencyP90: 43.16,
    latencyP50: 25,
    successCount: 364.1,
    totalCount: 364.1,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 364.1,
        totalCount: 364.1
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:38:15.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:38:29.000Z"),
    latencyAvg: 25.01,
    latencyP99: 46.86,
    latencyP95: 45.55,
    latencyP90: 43.15,
    latencyP50: 25.31,
    successCount: 363.7,
    totalCount: 363.7,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 363.7,
        totalCount: 363.7
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:38:30.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:38:44.000Z"),
    latencyAvg: 25.14,
    latencyP99: 47.23,
    latencyP95: 45.65,
    latencyP90: 43.32,
    latencyP50: 25.61,
    successCount: 360.5,
    totalCount: 360.5,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 360.5,
        totalCount: 360.5
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:38:45.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:38:59.000Z"),
    latencyAvg: 25.01,
    latencyP99: 47.08,
    latencyP95: 45.62,
    latencyP90: 43.12,
    latencyP50: 25.42,
    successCount: 364,
    totalCount: 364,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 364,
        totalCount: 364
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:39:00.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:39:14.000Z"),
    latencyAvg: 25.07,
    latencyP99: 47.06,
    latencyP95: 45.61,
    latencyP90: 43.28,
    latencyP50: 25.23,
    successCount: 348.5,
    totalCount: 348.5,
    label: null,
    responses: [
      {
        messages: ["OK"],
        responseCode: 200,
        successCount: 348.5,
        totalCount: 348.5
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:39:15.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:39:29.000Z"),
    latencyAvg: 25.6,
    latencyP99: 47.21,
    latencyP95: 45.65,
    latencyP90: 43.53,
    latencyP50: 26.19,
    successCount: 358.2,
    totalCount: 358.2,
    label: null,
    responses: [
      {
        messages: ["Bad request"],
        responseCode: 400,
        successCount: 358.2,
        totalCount: 358.2
      }
    ]
  },
  {
    minDatetime: toLocalDate("2022-01-13T15:39:30.000Z"),
    maxDatetime: toLocalDate("2022-01-13T15:39:33.000Z"),
    latencyAvg: 24.5,
    latencyP99: 47.5,
    latencyP95: 45.94,
    latencyP90: 43.24,
    latencyP50: 24.4,
    successCount: 93,
    totalCount: 93,
    label: null,
    responses: [
      {
        messages: ["Not Found"],
        responseCode: 404,
        successCount: 93,
        totalCount: 93
      }
    ]
  }
];

const expectedResponse = {
  datasets: [
    {
      label: 200,
      data: [
        {
          responseCode: 200,
          y: 147.6,
          x: toLocalDate("2022-01-13T15:37:38.000Z"),
          messages: ["OK"],
          totalCount: 147.6,
          successCount: 147.6
        },
        {
          responseCode: 200,
          y: 359.7,
          x: toLocalDate("2022-01-13T15:37:45.000Z"),
          messages: ["OK"],
          totalCount: 359.7,
          successCount: 359.7
        },
        {
          responseCode: 200,
          y: 364.1,
          x: toLocalDate("2022-01-13T15:38:00.000Z"),
          messages: ["OK"],
          totalCount: 364.1,
          successCount: 364.1
        },
        {
          responseCode: 200,
          y: 363.7,
          x: toLocalDate("2022-01-13T15:38:15.000Z"),
          messages: ["OK"],
          totalCount: 363.7,
          successCount: 363.7
        },
        {
          responseCode: 200,
          y: 360.5,
          x: toLocalDate("2022-01-13T15:38:30.000Z"),
          messages: ["OK"],
          totalCount: 360.5,
          successCount: 360.5
        },
        {
          responseCode: 200,
          y: 364,
          x: toLocalDate("2022-01-13T15:38:45.000Z"),
          messages: ["OK"],
          totalCount: 364,
          successCount: 364
        },
        {
          responseCode: 200,
          y: 348.5,
          x: toLocalDate("2022-01-13T15:39:00.000Z"),
          messages: ["OK"],
          totalCount: 348.5,
          successCount: 348.5
        },
        {
          responseCode: 200,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:15.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 200,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:30.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        }
      ],
      fill: false,
      backgroundColor: "#b7eb8f",
      borderColor: "#73d13d",
      tension: 0.2
    },
    {
      label: 400,
      data: [
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:37:38.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:37:45.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:00.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:15.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:30.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:45.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:00.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 400,
          y: 358.2,
          x: toLocalDate("2022-01-13T15:39:15.000Z"),
          messages: ["Bad request"],
          totalCount: 358.2,
          successCount: 358.2
        },
        {
          responseCode: 400,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:30.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        }
      ],
      fill: false,
      backgroundColor: "#ffd591",
      borderColor: "#ffa940",
      tension: 0.2
    },
    {
      label: 404,
      data: [
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:37:38.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:37:45.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:00.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:15.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:30.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:38:45.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:00.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 0,
          x: toLocalDate("2022-01-13T15:39:15.000Z"),
          messages: [],
          totalCount: 0,
          successCount: 0
        },
        {
          responseCode: 404,
          y: 93,
          x: toLocalDate("2022-01-13T15:39:30.000Z"),
          messages: ["Not Found"],
          totalCount: 93,
          successCount: 93
        }
      ],
      fill: false,
      backgroundColor: "#ffd591",
      borderColor: "#ffa940",
      tension: 0.2
    }
  ]
};

describe("lib/charts/datasets", () => {
  describe("metricsToResponseCodeLinesDataset", () => {
    test("should return list of custom data elements", async () => {
      const { datasets, minDatetime, maxDatetime } =
        metricsToResponseCodeLinesDataset(metrics);

      expect(datasets).toStrictEqual(expectedResponse.datasets);

      expect(minDatetime).toStrictEqual(
        toLocalDate("2022-01-13T15:37:38.000Z")
      );
      expect(maxDatetime).toStrictEqual(
        toLocalDate("2022-01-13T15:39:33.000Z")
      );
    });
  });
});
