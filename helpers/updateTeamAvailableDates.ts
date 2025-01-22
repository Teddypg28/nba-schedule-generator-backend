import { TeamAvailableDates } from "../types"

// when the date for a game is changed to a different date, update the available dates for the teams playing in the game
export default function updateTeamAvailableDates(teamAvailableDates: TeamAvailableDates, homeTeamName: string, awayTeamName: string, randomOpenDate: string, originalDate: string) {
    teamAvailableDates[homeTeamName].delete(randomOpenDate)
    teamAvailableDates[awayTeamName].delete(randomOpenDate)
    teamAvailableDates[homeTeamName].add(originalDate)
    teamAvailableDates[awayTeamName].add(originalDate)
}