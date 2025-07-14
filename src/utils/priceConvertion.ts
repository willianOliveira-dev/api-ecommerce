export default function priceConvertion(
    price: number,
    convertion: 'toReais' | 'toCents'
): string | number {
    if (convertion === 'toReais') {
        return (price / 100).toFixed(2);
    }
    return Math.round(price * 100);
}
