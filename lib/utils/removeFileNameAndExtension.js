import path from "path";

/**
 *
 * @param {string} filePath
 */
export function removeFileNameAndExtension(filePath) {
    const parsedPath = path.parse(filePath);

    return parsedPath.dir;
}
