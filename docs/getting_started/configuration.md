---
sidebar_position: 3
---

# Configuration

## Environment Variables

Maestro application services could be configured by using the Environment variable. There are two ways of passing the configuration to the service:

- Create `.env` file in the project root directory
- Make variables available in the environment where the application starts. There are a lot of ways how you define and use them, here is the link to [How to Set and List Environment Variables in Linux](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/).

### API

| Variable            | Description                                       | Value                                         | Default   |
| ------------------- | ------------------------------------------------- | --------------------------------------------- | --------- |
| `LOG_LEVEL`         | Level of log messages to output                   | Enum: _DEBUG, INFO, WARNING, ERROR, CRITICAL_ | INFO      |
| `MONGODB_HOST`      | Mongo Database host URL                           | _String_                                      | localhost |
| `MONGODB_PORT`      | Mongo Database port                               | _Number_                                      | 27017     |
| `MONGODB_DB`        | Mongo Database database                           | _String_                                      | maestro   |
| `SWAGGER_ENABLED`   | Enables swagger documentation available in `/api` | _Boolean_                                     | True      |
| `SCHEDULER_ENABLED` | Enables background jobs as a part of API.         | _Boolean_                                     | True      |

### Agent

| Variable                               | Description                                                                                                                                                                                            | Value                                         | Default                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| `ENABLE_MAESTRO_API_HANDLER`           | Send messages to Maestro API and make them available on the frontend.                                                                                                                                  | _Boolean_                                     | True                                      |
| `MAESTRO_API_HOST`                     | Provide Maestro API host                                                                                                                                                                               | _String_                                      | http://localhost:5000                     |
| `MAESTRO_METRICS_PROCESSING_WORKERS`   | Number of workers (threads) will process the metrics. Configure it based on the numbers of CPU cores. Run some tests to evalueate the best configuration, but consider starting by (number of CPU - 1) | _Number_                                      | 7                                         |
| `MAESTRO_METRICS_PROCESSING_BULK_SIZE` | Number of JMeter metrics in each request to API                                                                                                                                                        | _Number_                                      | 750                                       |
| `JMETER_IMAGE_BASE_REPO`               | Repository from where JMeter image should be pulled                                                                                                                                                    | _String_                                      |                                           |
| `JMETER_IMAGE_BASE_VERSION`            | JMeter version to run the test. It also used as tag for pulling repository                                                                                                                             | _String_                                      |                                           |
| `JMETER_IMAGE_HEAP`                    | JAVA HEAP configuration. Could be different based on machine resources                                                                                                                                 | _String_                                      | `-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m` |
| `JMETER_CONTAINER_NAME`                | Container name that would be built per each test run                                                                                                                                                   | _String_                                      | maestrojmeter                             |
| `HOST_MOUNT_DIR`                       | Host machine temporary directory to share the data between running containers                                                                                                                          | _String_                                      | `$HOME/.maestro/jmeter`                   |
| `LOG_LEVEL`                            | Level of log messages to output                                                                                                                                                                        | Enum: _DEBUG, INFO, WARNING, ERROR, CRITICAL_ | INFO                                      |
