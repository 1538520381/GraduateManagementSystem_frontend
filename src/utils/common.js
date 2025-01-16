export function isEmpty(field) {
    return field === null || field === undefined || field === "" || JSON.stringify(field) === "{}" || JSON.stringify(field) === "[]"
}