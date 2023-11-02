export function splitPath(path: string) {
    if(path.includes("/")) {
        return path.split("/")
    } else if (path.includes("\\")) {
        return path.split("\\")
    } else return [path]
}