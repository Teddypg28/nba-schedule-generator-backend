import { Game, Schedule } from "../types"

export default function undoGameDateChange(homeTeamScheduleGame: Game, awayTeamScheduleGame: Game, originalDate: string, currentSchedule: Schedule) {
    homeTeamScheduleGame.date = originalDate
    awayTeamScheduleGame.date = originalDate
    currentSchedule[homeTeamScheduleGame.home.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    currentSchedule[awayTeamScheduleGame.away.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
}