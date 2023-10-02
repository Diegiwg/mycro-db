import fs from "fs";

import { createDirectoriesRecursively } from "../utils/createDirectoriesRecursively.js";
import { removeFileNameAndExtension } from "../utils/removeFileNameAndExtension.js";
import { sortedJson } from "../utils/sortedJson.js";

export class JsonStorage {
    filePath;

    /**
     * @param {string} filePath
     */
    constructor(filePath) {
        this.filePath = filePath;

        this.bootstrap();
    }

    bootstrap() {
        const dirPath = removeFileNameAndExtension(this.filePath);
        createDirectoriesRecursively(dirPath);

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '{"collections": {}}');
        }
    }

    read() {
        return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }

    write(data) {
        fs.writeFileSync(this.filePath, sortedJson(data));
    }
}
