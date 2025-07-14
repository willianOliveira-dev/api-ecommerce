export default function updateData<T>(selectObj: T, body: T): T {
    for (let key in body) {
        if (selectObj[key] !== undefined) {
            selectObj[key] = body[key];
        }
    }
    return selectObj;
}
