import { Game } from "../types";

export default function insertNewGameDate(teamSchedule: Game[], randomOpenDate: string, newGameObject: Game) {
    let high = teamSchedule.length
    let low = 0
    const newDate = new Date(randomOpenDate).valueOf()
    while (low < high) {
        const mid = Math.floor((low + high) / 2)
        if (newDate <= new Date(teamSchedule[mid].date).valueOf()) {
            high = mid
        } else {
            low = mid + 1
        }
    }
    teamSchedule.splice(low, 0, newGameObject)
}