import express from "express";


import bodyParser from "body-parser";
import cors from "cors";
import logger from "./core/logger/app-logger";
import morgan from "morgan";
import config from "./core/config/config.dev";
import cars from "./routes/cars.route";
import deployments from "./routes/deployments.route";

import connectToDb from "./db/connect";

const fileUpload = require("express-fileupload");
const _ = require("lodash");

const port = config.serverPort;
logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

connectToDb();

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multipart());
app.use(morgan("dev", { stream: logger.stream }));

app.use("/cars", cars);
app.use("/deployments", deployments);

app.get("/", (req, res) => {
  res.send("Invalid endpoint!");
});

app.post("/upload-chaincodes", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      const data = [];

      // logger.info(req.files.chaincodes)
      // loop all files
      _.forEach(_.keysIn(req.files.chaincodes), (key) => {
        const photo = req.files.chaincodes[key];

        // move photo to uploads directory
        photo.mv(`./uploads/${photo.name}`);

        // push file details
        data.push({
          name: photo.name,
          mimetype: photo.mimetype,
          size: photo.size,
        });
      });

      // return response
      res.send({
        status: true,
        message: "Files are uploaded",
        data,
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  logger.info("server started - ", port);
});
