import path from "path";

/**
 * Removes the file name and extension from the given file path.
 *
 * @param {string} filePath The file path.
 * @returns {string} The directory path.
 */
export function removeFileNameAndExtension(filePath) {
    // Parse the file path using the path module
    const parsedPath = path.parse(filePath);

    // Return the directory path
    return parsedPath.dir;
}
