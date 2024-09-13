import express from "express";
import payload from "payload";
import apiRoutes from "./routes";

require("dotenv").config();
const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.use("/api", apiRoutes);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is now running on port ${port}`);
  });
};

start();
