export function getRedirectUrl(path: string, name: string) {
    if (path === "/") return path + name
    return path + "/" + name
}