import { Game, Schedule, TeamAvailableDates } from "../types"
import getMutualOpenDates from "./getMutualOpenDates"

export default function selectRandomGame(currentSchedule: Schedule, teamAvailableDates: TeamAvailableDates) {
    const randomTeam = Object.keys(currentSchedule)[Math.floor(Math.random() * 30)]
    const randomTeamSchedule = currentSchedule[randomTeam]
    
    const randomGame = randomTeamSchedule[Math.floor(Math.random() * randomTeamSchedule.length)]
    const originalDate = randomGame.date
    
    const homeTeamScheduleGame = currentSchedule[randomGame.home.name].find(game => game.id === randomGame.id) as Game
    const awayTeamScheduleGame = currentSchedule[randomGame.away.name].find(game => game.id === randomGame.id) as Game

    const mutualOpenDates = getMutualOpenDates(randomGame.home.name, randomGame.away.name, teamAvailableDates)

    return { mutualOpenDates, homeTeamScheduleGame, awayTeamScheduleGame, originalDate }
}