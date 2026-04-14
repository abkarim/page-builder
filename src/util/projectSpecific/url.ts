const protocolData = {
    prefix: "project://localhost/",
};

export function toProjectUrl(path: string): string {
    return `${protocolData.prefix}${path}`;
}
