type calculationToMilisecondType = "seconds" | "minutes" | "hours" | "days"

export function calculateMiliseconds(from: calculationToMilisecondType, quantity: number) {
    switch (from) {
        case "seconds":
            return quantity * 1000
        case "minutes":
            return quantity * 1000 * 60
        case "hours":
            return quantity * 1000 * 3600
        case "days":
            return quantity * 1000 * 3600 * 24
    
    }
}
export function calculateSeconds(from: calculationToMilisecondType, quantity: number) {
    switch (from) {
        case "seconds":
            return quantity
        case "minutes":
            return quantity * 60
        case "hours":
            return quantity * 3600
        case "days":
            return quantity * 3600 * 24
    
    }
}

export function getDateFromToday(from: calculationToMilisecondType, quantity: number) {
    let today = Date.now()
    today += calculateMiliseconds(from, quantity)
    return new Date(today)
}   