const express = require("express");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const taskProcessor = require("./taskProcessor");
const rateLimiter = require("./rateLimiter");

const app = express();
app.use(express.json());

app.post("/api/v1/task", async (req, res) => {
  const { user_id } = req.body;

  // Check rate limit
  if (await rateLimiter.isRateLimitExceeded(user_id)) {
    // Queue the task if rate limit exceeded
    await rateLimiter.enqueueTask(user_id, taskProcessor.task);
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  // Process the task
  await taskProcessor.task(user_id);

  // Update rate limit
  await rateLimiter.updateRateLimit(user_id);

  res.json({ message: "Task processed" });
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Create worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });

  // Process queued tasks
  setInterval(async () => {
    await rateLimiter.processQueuedTasks(taskProcessor.task);
  }, 100);
}
