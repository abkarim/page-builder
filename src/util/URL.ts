export function isUsingLocalAsset(url: string): boolean {
    return url.startsWith("/") && !url.startsWith("//");
}
