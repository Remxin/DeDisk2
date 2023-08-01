const sizesTab = ["B", "KB", "MB", "GB", "TB"] as const
type units = typeof sizesTab[number]

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

export function getStringBytesFromUnit(unit: units, s: number, round: number) {
    let unitIndex = sizesTab.findIndex(u => u === unit)
    let iterationIndex = 1
    
    while (s > 1024 ** iterationIndex) {
        console.log((s / 1024 ** iterationIndex) * round)
        s = Math.round((s / 1024 ** iterationIndex) * 10**round) / 10**round
        console.log(s)
        iterationIndex += 1
    }
    unitIndex += iterationIndex - 1

    return s + sizesTab[unitIndex]

}