import { create, defaults } from "axios";
import qs from "qs";

if (defaults)
  defaults.paramsSerializer = (params) =>
    qs.stringify(params, { indices: false }); // param=value1&param=value2

export const maestroClient = create({
  baseURL: "/",
  timeout: 30000,
  headers: {}
});
