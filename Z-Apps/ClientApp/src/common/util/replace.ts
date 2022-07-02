export function replace(str: string, before: string, after: string) {
    if (!str) {
        return "";
    }
    return str.split(before).join(after);
}
