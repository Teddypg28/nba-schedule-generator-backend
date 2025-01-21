import { TeamAvailableDates } from "../types"

// returns the available (non-scheduled) dates for each team
export default function getMutualOpenDates(homeTeamName: string, awayTeamName: string, teamAvailableDates: TeamAvailableDates) {
    const homeTeamAvailableDates = Array.from(teamAvailableDates[homeTeamName])
    const awayTeamAvailableDates = Array.from(teamAvailableDates[awayTeamName])
    return homeTeamAvailableDates.filter(date => awayTeamAvailableDates.includes(date))
}