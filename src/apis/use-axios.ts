import axios from "axios";

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

export default request;
