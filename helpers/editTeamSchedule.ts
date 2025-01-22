import { Game, Schedule } from "../types"
import insertNewGameDate from "./insertNewGameDate"

export default function editTeamSchedule(currentSchedule: Schedule, randomGame: Game, newDate: string) {
    const newGameObject = {
        id: randomGame.id,
        home: randomGame.home,
        away: randomGame.away,
        arena: randomGame.arena,
        date: newDate
    }
    // find the indices of the game in each team's schedule
    const homeTeamScheduleGameIndex = currentSchedule[randomGame.home.name].findIndex(game => game.id === randomGame.id)
    const awayTeamScheduleGameIndex = currentSchedule[randomGame.away.name].findIndex(game => game.id === randomGame.id)
    // delete the game from each team's schedule
    currentSchedule[randomGame.home.name].splice(homeTeamScheduleGameIndex, 1)
    currentSchedule[randomGame.away.name].splice(awayTeamScheduleGameIndex, 1)
    // insert the new game object
    insertNewGameDate(currentSchedule[randomGame.home.name], newDate, newGameObject)
    insertNewGameDate(currentSchedule[randomGame.away.name], newDate, newGameObject)
}