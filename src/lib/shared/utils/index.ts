export const mapSlotToDurationTime = (slot: string) => {
    if (slot === "Morning") {
        return "09:00 - 12:00"
    }
    else if (slot === "Lunch") {
        return "12:00 - 13:00"
    }
    else if (slot === "Afternoon") {
        return "13:00 - 16:00"
    }
    return "Error"
}