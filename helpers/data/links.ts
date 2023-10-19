export function getLastUrlPart(url: string) {
    const urlParts = url.split("/")
    return urlParts[urlParts.length - 1]
}

export function getUrlPartFromEnd(url: string, n: number) {
    const urlParts = url.split("/")
    return urlParts[urlParts.length - n]
}