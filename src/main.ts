import "uno.css";
import "@/style.scss";
import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { useTheme } from "@/config";

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.config.globalProperties.isBlogOwner = isBlogOwner;
app.config.globalProperties.isLogined = isLogined;

useTheme(app);
