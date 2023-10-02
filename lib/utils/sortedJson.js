export function sortedJson(data) {
    return JSON.stringify(data, (key, value) => {
        if (typeof value === "object") {
            return Object.keys(value)
                .sort()
                .reduce((sortedObj, key) => {
                    sortedObj[key] = value[key];
                    return sortedObj;
                }, {});
        }
        return value;
    });
}
