import { Game, Schedule } from "../types"

export default function changeGameDate(mutualOpenDates: string[], homeTeamScheduleGame: Game, awayTeamScheduleGame: Game, currentSchedule: Schedule) {
    const randomOpenDate = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
            
    homeTeamScheduleGame.date = randomOpenDate
    awayTeamScheduleGame.date = randomOpenDate

    currentSchedule[homeTeamScheduleGame.home.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    currentSchedule[awayTeamScheduleGame.away.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())

    return randomOpenDate
}