/* Import Vue */
import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";
import { createPinia } from "pinia";

/* Import CSS */
import "uno.css";
import "./style.scss";

/* Import Ecy */
import { useDirective } from "./directive";

const app = createApp(App);
app.use(router);
app.use(createPinia());

useDirective(app);
EcyConfig.useLite(
  () => app.mount("#app"),
  () => {
    // initLiteVars();
    app.mount("#app");
  }
);
