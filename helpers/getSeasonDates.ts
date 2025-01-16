
// returns the full slate of dates for an NBA season, excluding days off such as Thanksgiving, Christmas Eve, and the All Star Break
export default function getSeasonDates() {
    const noGamesDates = [new Date(2024, 11, 24), new Date(2025, 1, 14), new Date(2025, 1, 15), new Date(2025, 1, 16), new Date(2025, 1, 17), new Date(2025, 1, 18), new Date(2025, 1, 19)]
    const noGamesDatesSet = new Set(noGamesDates.map(date => date.toLocaleDateString()))
    const seasonDates = []
    const startDate = new Date(2024, 9, 22)
    const endDate = new Date(2025, 3, 13)

    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
        if (!noGamesDatesSet.has(currentDate.toLocaleDateString())){
            seasonDates.push(new Date(currentDate).toLocaleDateString())
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return seasonDates
}