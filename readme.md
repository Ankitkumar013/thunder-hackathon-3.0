# Thunder Hackathon 3.0 - System Info & CRUD Tool

A JavaScript (Node.js) tool built to gather system information, environment variables, and perform robust CRUD operations on code files. This project is built specifically to pass the evaluation criteria for Thunder Hackathon 3.0.

## Table of Contents
- [Requirements Addressed](#requirements-addressed)
- [How to Run](#how-to-run)
- [Code Flow and Strategy](#code-flow-and-strategy)
- [Explanation of Collected Data](#explanation-of-collected-data)

---

## Requirements Addressed
1. **JavaScript (Node.js)**: The entire script is written in modern ES6+ Node.js syntax utilizing asynchronous promises.
2. **Structured Format Display**: Output is displayed cleanly in a structured JSON format via the console.
3. **Handle Missing Values**: A specialized `safeGet()` method guarantees that if an environment variable or system property is missing/null, it gracefully falls back to `"Not Available"`.
4. **Clear Documentation**: Detailed comments in code and this comprehensive `readme.md`.
5. **Code Flow & Strategy in README**: Documented below.

---

## How to Run

1. Ensure [Node.js](https://nodejs.org/) is installed on your system.
2. Open your terminal or command prompt.
3. Navigate to the directory containing this project.
4. Run the script:
   ```bash
   node index.js
   ```

---

## Code Flow and Strategy

The project architecture relies on Object-Oriented Programming (OOP) to keep concerns separated and the code highly maintainable.

### 1. `SystemInfoCollector` Class (Information Gathering Strategy)
- **Goal**: Fetch platform details safely without hard crashing.
- **Strategy**: 
  - We use the built-in `os` and `process` modules to gather metadata. 
  - To fulfill the "Handle missing values gracefully" requirement, a static method `safeGet(value, fallback)` acts as a protective wrapper. Every piece of data fetched passes through this wrapper. If the data is undefined or null (like a missing environment variable), it outputs the fallback message rather than `undefined`.
- **Flow**: The `gatherInfo()` method builds a deeply nested JSON object structure, which is then formatted and logged to the console using `JSON.stringify(data, null, 4)` for high readability.

### 2. `FileManager` Class (CRUD Operation Strategy)
- **Goal**: Demonstrate Create, Read, Update, and Delete operations on local files.
- **Strategy**: 
  - We use the `fs/promises` API. This prevents "callback hell" and allows us to use modern `async/await` flows, ensuring operations happen synchronously in the order we intend.
  - Every CRUD method is wrapped in a `try...catch` block. This fulfills the "Error handling" evaluation criteria. If a read operation fails because a file was deleted, the app will log a descriptive error instead of crashing.
- **Flow**: The `main()` execution block instantiates this class, creates a file, reads it to prove creation, updates it by appending a string, reads it again to prove the update, and finally deletes the file to clean up the workspace.

---

## Explanation of Collected Data

The tool collects the following key metrics, categorized into three sections:

### 1. System Information
- **`operatingSystem`**: The core OS type and release version (e.g., Windows_NT 10.0.19045).
- **`platform`**: The compiler platform identifier (e.g., `win32`, `linux`, `darwin`).
- **`cpuArchitecture`**: The system architecture type (e.g., `x64`, `arm64`).
- **`hostname`**: The network name of the machine.
- **`userHomeDirectory`**: The absolute path to the current user's profile directory, useful for resolving local configs.

### 2. Runtime Information
- **`nodeVersion`**: The exact version of Node.js executing the script (e.g., `v18.16.0`). Helps ensure compatibility for scripts.

### 3. Selected Environment Variables
- **`path`**: The system PATH variable, dictating where the OS looks for executables.
- **`user`**: The active system user (mapped from `USERNAME` or `USER` depending on OS).
- **`os`**: Detailed OS name environment variable (Common in Windows).
- **`missingExample`**: A deliberate attempt to fetch a variable that doesn't exist (`NON_EXISTENT_VAR`) to demonstrate the tool's graceful fallback capabilities.
