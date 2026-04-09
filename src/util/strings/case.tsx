export const toPascalCase = (str: string) => {
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};

export function capitalize(str: string) {
    return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}
