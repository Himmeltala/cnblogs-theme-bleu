import axios from "axios";

const request = axios.create({
  baseURL: `${Consts.getBaseURL()}`,
  timeout: 5000
});

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
    ElMessage.error(error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  config => {
    return config;
  },
  error => {
    ElMessage.error(error);
    return Promise.reject(error);
  }
);

export default request;
