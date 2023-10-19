export function getModifiedPath(originalPath: string) {
    return originalPath[0] + originalPath.replaceAll("/", "|").slice(1)
}

export function getOriginalPath(modifiedPath: string) {
    return modifiedPath.replaceAll("|", "/")
}