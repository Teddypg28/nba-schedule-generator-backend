import { TeamAvailableDates } from "../types"

// when the date for a game is swapped with another date, update the available dates for the teams playing
export default function updateTeamAvailableDates(teamAvailableDates: TeamAvailableDates, homeTeam: string, awayTeam: string, randomOpenDate: string, originalDate: string) {
    teamAvailableDates[homeTeam].delete(randomOpenDate)
    teamAvailableDates[awayTeam].delete(randomOpenDate)
    teamAvailableDates[homeTeam].add(originalDate)
    teamAvailableDates[awayTeam].add(originalDate)
}