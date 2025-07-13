export default function orderValuesArray<T, K extends keyof T>(
    body: T,
    keysColumn: K[]
): T[K][] {
    return keysColumn.reduce((acc: T[K][], currentValue: K) => {
        acc.push(body[currentValue]);
        return acc;
    }, []);
}
