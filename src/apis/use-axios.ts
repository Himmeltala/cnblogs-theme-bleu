import axios from "axios";
import router from "@/router";

const request = axios.create({
  baseURL: `${BleuVars.getBaseURL()}`,
  timeout: 5000
});
const loading = new Broswer.Loading();

function getToken() {
  let token = "";
  const tokenInst = document.getElementById("antiforgery_token");
  if (!!tokenInst) token = tokenInst.getAttribute("value");
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
    ElMessage({ message: "请求失败！", type: "error", grouping: true });
    router.push("/");
    loading.endLoading();
    return Promise.reject(error);
  }
);

export default request;
