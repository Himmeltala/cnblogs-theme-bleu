import axios from "axios";
import router from "@/router";

const request = axios.create({
  baseURL: `${BleuVars.getBaseURL()}`,
  timeout: 5000
});

function getToken() {
  let token = "";
  const ele = document.getElementById("antiforgery_token");
  if (!!ele) token = ele.getAttribute("value");
  return token;
}

request.interceptors.request.use(
  config => {
    if (config.method === "post") {
      config.headers["RequestVerificationToken"] = getToken();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  config => {
    return config;
  },
  error => {
    ElMessage({ message: "失败请求，请稍后再试！", type: "error", grouping: true });
    Broswer.endLoading();
    router.push("/");
    return Promise.reject(error);
  }
);

export default request;
