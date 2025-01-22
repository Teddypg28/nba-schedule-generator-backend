import { Game } from "../types"

export default function getNewDate(mutualOpenDates: string[], randomGame: Game) {
    const randomOpenDate = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
    const originalDate = randomGame.date
    return {originalDate, randomOpenDate}
}