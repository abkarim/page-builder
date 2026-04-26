export function getBaseName(filepath: string): string {
    const lastDotIndex = filepath.lastIndexOf(".");

    return lastDotIndex === -1 ? filepath : filepath.substring(0, lastDotIndex);
}
