import { Game, TeamAvailableDates } from "../types"
import getNumTriples from "./getNumTriples"
import getTeamAvailableDates from "./getTeamAvailableDates"

// uses hill climbing to remove back to back to back games from a given schedule
export default function removeTriples(schedule: Game[]) { 
    let triples = getNumTriples(schedule)
    let bestSchedule = JSON.parse(JSON.stringify(schedule))
    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)
    while (triples > 0) {
        const randomGame = schedule[Math.floor(Math.random() * schedule.length)]
        const originalDate = randomGame.date
        const homeTeamAvailableDates = Array.from(teamAvailableDates[randomGame.home])
        const awayTeamAvailableDates = Array.from(teamAvailableDates[randomGame.away])
        const mutualOpenDates = homeTeamAvailableDates.filter(date => awayTeamAvailableDates.includes(date))
        if (mutualOpenDates.length > 0) {
            const randomOpenDate = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
            randomGame.date = randomOpenDate
            const numTriples = getNumTriples(schedule)
            if (numTriples < triples) {
                triples = numTriples
                bestSchedule = JSON.parse(JSON.stringify(schedule))
                teamAvailableDates[randomGame.home].delete(randomOpenDate)
                teamAvailableDates[randomGame.away].delete(randomOpenDate)
                teamAvailableDates[randomGame.home].add(originalDate)
                teamAvailableDates[randomGame.away].add(originalDate)
            } 
            else {
                randomGame.date = originalDate
            }
        }
    }
    return bestSchedule
}