import fs from "fs";
import path from "path";

/**
 *
 * @param {string} fullPath
 */
export function createDirectoriesRecursively(fullPath) {
    const dirs = fullPath.split(/\\|\//);

    let currentDir = "";
    for (const dir of dirs) {
        currentDir = path.join(currentDir, dir);
        if (!fs.existsSync(currentDir)) {
            fs.mkdirSync(currentDir);
        }
    }
}
