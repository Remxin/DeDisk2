export function getModifiedPath(originalPath: string) {
    return originalPath[0] + originalPath.replaceAll("/", "|").slice(1)
}

export function getOriginalPath(modifiedPath: string) {
    return modifiedPath.replaceAll("|", "/")
}

export function isFilePath(path: string) {
    let pathParts = path.split("/")
    const lastPathPart = pathParts[pathParts.length - 1]
    
    if (/\./.test(lastPathPart)) return true
    return false
}