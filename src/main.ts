/* Import Vue */
import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";
import { createPinia } from "pinia";

/* Import CSS */
// uno style
import "uno.css";
// ecy style
import "./style.scss";

/* Import Ecy */
import { useDirective } from "./directive";

/* Start */
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
