import fs from "fs";

import { createDirectoriesRecursively } from "../utils/createDirectoriesRecursively.js";
import { removeFileNameAndExtension } from "../utils/removeFileNameAndExtension.js";

export class JsonStorage {
    filePath;

    /**
     * A storage for operations that require data persistence and maintain a JSON file structure.
     *
     * @param {string} filePath Path to the file where the data will be stored.
     */
    constructor(filePath) {
        this.filePath = filePath;

        this.bootstrap();
    }

    /** @private */
    bootstrap() {
        const dirPath = removeFileNameAndExtension(this.filePath);
        createDirectoriesRecursively(dirPath);

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '{"collections": {}}');
        }
    }

    /** @public */
    read() {
        return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }

    /** @public */
    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data));
    }
}
