/**
 * Validates a document against a given schema.
 *
 * @param {Object} schema - The schema to validate against.
 * @param {Object} doc - The document to validate.
 * @throws {Error} Throws an error if the document is invalid.
 * @return {Object} Returns the validated document.
 */
export function validateSchema(schema, doc) {
    const keysInSchema = Object.keys(schema);

    for (const key of Object.keys(doc)) {
        if (Array.isArray(doc[key])) {
            const strictType = typeof schema[key][0];

            for (let i = 0; i < doc[key].length; i++) {
                const docType = typeof doc[key][i];

                if (docType !== strictType) {
                    throw new Error(
                        `Invalid type in [${key}] array: ${docType} is not a ${strictType}`
                    );
                }

                if (typeof doc[key][i] === "object" && doc[key][i] !== null) {
                    validateSchema(schema[key][0], doc[key][i]);
                }
            }
            return;
        }

        if (typeof doc[key] === "object" && doc[key] !== null) {
            validateSchema(schema[key], doc[key]);
            continue;
        }

        if (typeof schema[key] !== typeof doc[key]) {
            throw new Error(
                `Invalid type for [${key}]: ${typeof doc[
                    key
                ]} is not a ${typeof schema[key]}`
            );
        }

        if (!keysInSchema.includes(key)) {
            throw new Error(`Invalid key present in document: ${key}`);
        }
    }

    return doc;
}
