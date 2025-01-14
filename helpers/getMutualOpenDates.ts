import { TeamAvailableDates } from "../types"

// returns the available (non-scheduled) dates for each team
export default function getMutualOpenDates(homeTeam: string, awayTeam: string, teamAvailableDates: TeamAvailableDates) {
    const homeTeamAvailableDates = Array.from(teamAvailableDates[homeTeam])
    const awayTeamAvailableDates = Array.from(teamAvailableDates[awayTeam])
    return homeTeamAvailableDates.filter(date => awayTeamAvailableDates.includes(date))
}