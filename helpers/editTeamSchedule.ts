import { Game, Schedule } from "../types"
import insertNewGameDate from "./insertNewGameDate"

export default function editTeamSchedule(currentSchedule: Schedule, currentGame: Game, newDate: string) {
    const newGameObject = {
        home: currentGame.home,
        away: currentGame.away,
        arena: currentGame.arena,
        date: newDate
    }
    // find the indices of the game in each team's schedule
    const homeTeamScheduleGameIndex = currentSchedule[currentGame.home.name].findIndex(game => game.date === currentGame.date)
    const awayTeamScheduleGameIndex = currentSchedule[currentGame.away.name].findIndex(game => game.date === currentGame.date)
    // delete the game from each team's schedule
    currentSchedule[currentGame.home.name].splice(homeTeamScheduleGameIndex, 1)
    currentSchedule[currentGame.away.name].splice(awayTeamScheduleGameIndex, 1)
    // insert the new game object
    insertNewGameDate(currentSchedule[currentGame.home.name], newDate, newGameObject)
    insertNewGameDate(currentSchedule[currentGame.away.name], newDate, newGameObject)
    // return new game data
    return newGameObject
}