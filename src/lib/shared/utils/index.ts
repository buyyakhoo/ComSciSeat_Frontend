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

export const DAY_NAMES: Record<number, string> = {
    0: 'อาทิตย์', 1: 'จันทร์', 2: 'อังคาร', 3: 'พุธ', 4: 'พฤหัสบดี', 5: 'ศุกร์', 6: 'เสาร์'
}