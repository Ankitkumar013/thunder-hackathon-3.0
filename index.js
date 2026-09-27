// const os = require('os');
const process = require('process');
const fs = require('fs').promises;
const path = require('path');

/**
 * Class responsible for gathering system and environment information.
 */
class SystemInfoCollector {
    constructor() {
        this.info = {};
    }

    /**
     * Safely retrieves a value, returning a fallback if undefined or null.
     */
    static safeGet(value, fallback = 'Not Available') {
        return (value !== undefined && value !== null && value !== '') ? value : fallback;
    }

    gatherInfo() {
        this.info = {
            system: {
                operatingSystem: SystemInfoCollector.safeGet(`${os.type()} ${os.release()}`),
                platform: SystemInfoCollector.safeGet(os.platform()),
                cpuArchitecture: SystemInfoCollector.safeGet(os.arch()),
                hostname: SystemInfoCollector.safeGet(os.hostname()),
                userHomeDirectory: SystemInfoCollector.safeGet(os.homedir())
            },
            runtime: {
                nodeVersion: SystemInfoCollector.safeGet(process.version)
            },
            environmentVariables: {
                path: SystemInfoCollector.safeGet(process.env.PATH),
                user: SystemInfoCollector.safeGet(process.env.USERNAME || process.env.USER),
                os: SystemInfoCollector.safeGet(process.env.OS),
                missingExample: SystemInfoCollector.safeGet(process.env.NON_EXISTENT_VAR, 'Value Not Found (Gracefully Handled)')
            }
        };
        return this.info;
    }

    displayInfo() {
        const data = this.gatherInfo();
        console.log('\n======================================================');
        console.log('                 SYSTEM INFORMATION                   ');
        console.log('======================================================\n');
        console.log(JSON.stringify(data, null, 4));
        console.log('\n======================================================\n');
    }
}

/**
 * Class responsible for demonstrating CRUD operations on files.
 */
class FileManager {
    constructor(targetFilePath) {
        this.targetFilePath = targetFilePath;
    }

    async create(content) {
        try {
            await fs.writeFile(this.targetFilePath, content, 'utf8');
            console.log(`[CREATE] Successfully created file at: ${this.targetFilePath}`);
        } catch (error) {
            console.error(`[ERROR - CREATE] Failed to create file: ${error.message}`);
        }
    }

    async read() {
        try {
            const data = await fs.readFile(this.targetFilePath, 'utf8');
            console.log(`[READ] File content:\n---\n${data}\n---`);
            return data;
        } catch (error) {
            console.error(`[ERROR - READ] Failed to read file (It might not exist): ${error.message}`);
        }
    }

    async update(content) {
        try {
            // Append content to demonstrate update
            await fs.appendFile(this.targetFilePath, `\n${content}`, 'utf8');
            console.log(`[UPDATE] Successfully appended data to: ${this.targetFilePath}`);
        } catch (error) {
            console.error(`[ERROR - UPDATE] Failed to update file: ${error.message}`);
        }
    }

    async delete() {
        try {
            await fs.unlink(this.targetFilePath);
            console.log(`[DELETE] Successfully deleted file: ${this.targetFilePath}`);
        } catch (error) {
            console.error(`[ERROR - DELETE] Failed to delete file: ${error.message}`);
        }
    }
}

/**
 * Main execution flow
 */
async function main() {
    // 1. Gather and Display System Info
    const collector = new SystemInfoCollector();
    collector.displayInfo();

    // 2. Demonstrate CRUD Operations
    console.log('Starting CRUD Operations Demonstration...\n');
    const crudFilePath = path.join(__dirname, 'crud_test_file.txt');
    const fileManager = new FileManager(crudFilePath);

    // Ensure clean state by deleting if it exists from a previous run
    try { await fs.unlink(crudFilePath); } catch (e) { /* Ignore if it doesn't exist */ }

    // Execute CRUD flow sequentially
    await fileManager.create('Initial data for CRUD test.');
    await fileManager.read();
    await fileManager.update('This is an updated line added during the UPDATE phase.');
    await fileManager.read();
    await fileManager.delete();
    
    console.log('\nOperations Completed Successfully.');
}

// Execute the program
main().catch(err => {
    console.error('An unexpected error occurred in the main execution block:', err);
});
