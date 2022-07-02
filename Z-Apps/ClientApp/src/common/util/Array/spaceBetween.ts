export function spaceBetween(...arr: (string | undefined | null)[]): string {
    return arr.filter(s => s).join(" ");
}
