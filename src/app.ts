import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import api from "./api";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

app.get<{}, { message: string }>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use(middlewares.handleAuth);
app.use("/api/v1", api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
