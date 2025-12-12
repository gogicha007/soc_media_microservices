import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mediaRoutes from "./routes/media-routes.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3003;

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

//middleware
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Content-Type: ${req.headers['content-type']}`);
  next();
});

// Don't use express.json() before file upload routes - it consumes the body stream

// IP based rate limiting for sensitive endpoints

// routes ->
app.use("/api/media", mediaRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Media service is running on port ${PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
