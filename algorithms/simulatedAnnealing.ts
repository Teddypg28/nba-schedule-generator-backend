import { Game } from "../types";

import getMutualOpenDates from "../helpers/getMutualOpenDates";
import getNumBackToBacks from "../helpers/getNumBackToBacks";
import getTeamAvailableDates from "../helpers/getTeamAvailableDates";
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates";
import calculateScheduleCost from "../helpers/calculateScheduleCost";

export default function simulatedAnnealing(schedule: Game[], temperature: number, coolingRate: number) {
    let iterations = 0
    let currentCost = getNumBackToBacks(schedule)
    let currentSchedule = JSON.parse(JSON.stringify(schedule))
    let bestSchedule = JSON.parse(JSON.stringify(currentSchedule))

    const teamAvailableDates: any = getTeamAvailableDates(schedule)

    while (temperature > 0.05) {
        const randomGame = currentSchedule[Math.floor(Math.random() * schedule.length)]
        const originalDate = randomGame.date
        const mutualOpenDates = getMutualOpenDates(randomGame.home, randomGame.away, teamAvailableDates)
        if (mutualOpenDates.length > 0) {
            const randomOpenDate: any = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
            randomGame.date = randomOpenDate
            const cost = calculateScheduleCost(currentSchedule)
            if (cost < currentCost) {
                currentCost = cost
                bestSchedule = JSON.parse(JSON.stringify(currentSchedule))
                updateTeamAvailableDates(teamAvailableDates, randomGame.home, randomGame.away, randomOpenDate, originalDate)
            } 
            else {
                const acceptanceProbability = Math.exp((currentCost - cost) / temperature)
                if (Math.random() < acceptanceProbability) {
                    currentCost = cost
                    updateTeamAvailableDates(teamAvailableDates, randomGame.home, randomGame.away, randomOpenDate, originalDate)

                } else {
                    randomGame.date = originalDate
                }
            }
        }
        temperature *= coolingRate
        iterations++
    }
    return bestSchedule
}