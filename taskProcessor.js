async function task(user_id) {
  console.log(`${user_id}-task completed at-${Date.now()}`);
  // Store task completion in a log file
  await appendToLogFile(`${user_id}-task completed at-${Date.now()}`);
}

// Log task completion to a file
async function appendToLogFile(message) {
  return new Promise((resolve, reject) => {
    fs.appendFile("task_log.txt", `${message}\n`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  task,
};
