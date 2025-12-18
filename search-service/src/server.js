import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectToRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import searchRoutes from "./routes/search-routes.js";
import { handlePostCreated } from "./event-handlers/search-event-handlers.js";

const app = express();
const PORT = process.env.PORT || 3004;

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body:`, JSON.stringify(req.body, null, 2));
  next();
});

app.use("/api/search", searchRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();

    // consume the events / subscribe to the events
    await consumeEvent("post.created", handlePostCreated);
  } catch (e) {
    logger.error(e, "Failed to start search service");
    process.exit(1);
  }
}

startServer()
