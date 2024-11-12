# Node.js API Cluster with Robust Task Processing and Rate Limiting

This is a Node.js API cluster with two replica sets that implements a queueing system to handle a simple task with rate limiting.

## Features

- **API Route**: The `/api/v1/task` route accepts a `POST` request with a `user_id` in the request body.
- **Rate Limiting**: The rate limit is enforced at 1 task per second and 20 tasks per minute for each user ID. Requests exceeding the rate limit are queued and processed accordingly.
- **Queueing System**: A queue is maintained for each user ID to manage tasks that exceed the rate limit. The queued tasks are processed as soon as the rate limit allows.
- **Task Processing**: The `task` function is used to log the task completion along with the user ID and timestamp. The logs are stored in a `task_log.txt` file.
- **Cluster Setup**: The API is set up as a cluster with multiple worker processes to handle incoming requests.
- **Resilience**: The API is resilient to failures and edge cases. No requests are dropped, and all tasks are processed according to the rate limit.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/adityadixit07/node-multiprocess-api-with-rate-limit.git
   ```
2. Navigate to the project directory:
   ```
   cd node-api-cluster
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the API cluster:

   ```
   npm start
   ```

   The server will start running on `http://localhost:3000`.

2. Send a POST request to the `/api/v1/task` endpoint with a `user_id` in the request body:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"user_id":"123"}' http://localhost:3000/api/v1/task
   ```
   This will process the task and log the completion details in the `task_log.txt` file.

## Rate Limiting

The rate limiting mechanism enforces the following limits:

- 1 task per second per user ID
- 20 tasks per minute per user ID

If a request exceeds the rate limit, it will be queued and processed as soon as the rate limit allows.

## Logging

The `task` function logs the task completion details, including the user ID and timestamp, in the `task_log.txt` file.

## Cluster Setup

The API is set up as a cluster with multiple worker processes to handle incoming requests. If a worker process dies, a new one will be spawned to maintain the cluster.

## Error Handling and Resilience

The API is designed to be resilient to failures and edge cases. No requests will be dropped, and all tasks will be processed according to the rate limit. If an error occurs during task processing, it will be logged, and the system will continue to process other tasks.

## Project Structure

The project is structured into the following modules:

1. **taskProcessor.js**: Handles the task processing logic, including the `task` function and the log file operations.
2. **rateLimiter.js**: Handles the rate limiting and task queueing logic.
3. **server.js**: Serves as the main entry point and coordinates the interactions between the other modules.
