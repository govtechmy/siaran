import express from "express";
import payload from "payload";
import path from "path";
import cookieParser from "cookie-parser";

require("dotenv").config();

const app = express();
app.use(cookieParser());

// Serve assets
app.use("/assets", express.static(path.resolve(__dirname, "./assets")));

app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.get("/health", (_, res) => {
  res.send("OK");
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is now running on port ${port}`);
  });
};

start();
