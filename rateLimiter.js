const rateLimit = {};
const taskQueue = {};

// Check if rate limit is exceeded for a user
async function isRateLimitExceeded(user_id) {
  if (rateLimit[user_id]?.lastTaskTime + 1000 > Date.now()) {
    return true;
  }

  if (rateLimit[user_id]?.taskCount >= 20) {
    return true;
  }

  return false;
}

// Enqueue a task for a user
async function enqueueTask(user_id, taskFn) {
  if (!taskQueue[user_id]) {
    taskQueue[user_id] = [];
  }
  taskQueue[user_id].push(taskFn);
}

// Update the rate limit for a user
async function updateRateLimit(user_id) {
  if (!rateLimit[user_id]) {
    rateLimit[user_id] = {
      lastTaskTime: Date.now(),
      taskCount: 1,
    };
  } else {
    rateLimit[user_id].lastTaskTime = Date.now();
    rateLimit[user_id].taskCount++;
  }
}

// Process queued tasks
async function processQueuedTasks(taskFn) {
  const userIds = Object.keys(taskQueue);
  for (const userId of userIds) {
    if (!(await isRateLimitExceeded(userId))) {
      const task = taskQueue[userId].shift();
      if (task) {
        await task();
        await updateRateLimit(userId);
      }
    }
  }
}

module.exports = {
  isRateLimitExceeded,
  enqueueTask,
  updateRateLimit,
  processQueuedTasks,
};
