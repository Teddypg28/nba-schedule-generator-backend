import { Game, TeamAvailableDates } from "../types"

import getMutualOpenDates from "../helpers/getMutualOpenDates"
import getTeamAvailableDates from "../helpers/getTeamAvailableDates"
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates"
import calculateScheduleCost from "../helpers/calculateScheduleCost"
import removeTriples from "../helpers/removeTriples"

export default function hillClimbing(schedule: Game[]) {
    let iterations = 0
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Game[] = JSON.parse(JSON.stringify(schedule))
    let bestSchedule: Game[] = JSON.parse(JSON.stringify(currentSchedule))

    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)

    while (iterations < 50000) {
        const randomGame = currentSchedule[Math.floor(Math.random() * schedule.length)]
        const originalDate = randomGame.date
        const mutualOpenDates = getMutualOpenDates(randomGame.home, randomGame.away, teamAvailableDates)
        if (mutualOpenDates.length > 0) {
            const randomOpenDate = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
            randomGame.date = randomOpenDate
            const cost = calculateScheduleCost(currentSchedule)
            if (cost < currentCost) {
                currentCost = cost
                bestSchedule = JSON.parse(JSON.stringify(currentSchedule))
                updateTeamAvailableDates(teamAvailableDates, randomGame.home, randomGame.away, randomOpenDate, originalDate)
            } 
            else {
                randomGame.date = originalDate
            }
        }
        iterations++
    }
    return removeTriples(bestSchedule)
}