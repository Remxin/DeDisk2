const sizesTab = ["B", "KB", "MB", "GB", "TB"]

export function getBytes(size: string) {
    let [num, unit] = size.split("_")

    //@ts-ignore
    num = +num


    let index = sizesTab.findIndex(i => i === unit)
    //@ts-ignore
    return num * 1024 ** index
}