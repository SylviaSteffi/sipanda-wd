import { config } from "./config/index.js";
import { createApp } from "./adapters/primary/rest/app.js";
import { initDB } from "./config/database/index.js";

const app = createApp();

initDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
  });
});
