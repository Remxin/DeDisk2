const sizesTab = ["B", "KB", "MB", "GB", "TB"]

export function getBytes(size: string) {
    let [num, unit] = size.split("_")

    //@ts-ignore
    num = +num


    let index = sizesTab.findIndex(i => i === unit)
    //@ts-ignore
    return num * 1024 ** index
}

export function getBytesString(bytes: number, round: number) {
    let index = 1
    while (bytes < 1024 ** index) {
        index += 1
    }
    const size = Math.round((bytes / 1024**index) * 10*round) / (10*round)
    return size + sizesTab[index - 1]
}