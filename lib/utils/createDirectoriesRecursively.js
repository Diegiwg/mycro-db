import fs from "fs";
import path from "path";

/**
 * Creates directories recursively based on the provided full path.
 *
 * @param {string} fullPath The full path of the directory to be created.
 */
export function createDirectoriesRecursively(fullPath) {
    // Split the full path into individual directory names
    const dirs = fullPath.split(/\\|\//);

    let currentDir = "";
    // Loop through each directory name and create the corresponding directory
    for (const dir of dirs) {
        // Append the current directory name to the current directory path
        currentDir = path.join(currentDir, dir);
        // Check if the current directory already exists
        if (!fs.existsSync(currentDir)) {
            // Create the current directory if it doesn't exist
            fs.mkdirSync(currentDir);
        }
    }
}
