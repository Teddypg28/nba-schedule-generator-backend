import { Game } from "../types"

export default function selectRandomOpenDate(mutualOpenDates: string[], randomGame: Game) {
    return mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
}