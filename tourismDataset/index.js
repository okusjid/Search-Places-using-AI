import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import routes from "./Controllers/index.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`The project is running on PORT ${PORT}`);
});
