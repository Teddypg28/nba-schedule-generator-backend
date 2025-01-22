import { Schedule, TeamAvailableDates } from "../types";

import getTeamAvailableDates from "../helpers/getTeamAvailableDates";
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates";
import calculateScheduleCost from "../helpers/calculateScheduleCost";

import selectRandomGame from "../helpers/selectRandomGame";
import getMutualOpenDates from "../helpers/getMutualOpenDates";
import editTeamSchedule from "../helpers/editTeamSchedule";
import selectRandomOpenDate from "../helpers/selectRandomOpenDate";

export default function simulatedAnnealing(schedule: Schedule, temperature: number, coolingRate: number, iterations: number) {
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Schedule = JSON.parse(JSON.stringify(schedule))
    let bestSchedule = currentSchedule
    let numIterations = 0

    const initialTemperature = temperature
    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)

    while (numIterations < iterations) {
        // reset the temperature for each iteration
        temperature = initialTemperature
        while (temperature > 0.001) {
            // select random game
            const randomGame = selectRandomGame(currentSchedule)
            const mutualOpenDates = getMutualOpenDates(randomGame.home.name, randomGame.away.name, teamAvailableDates)
            if (mutualOpenDates.length > 0) {
                // save original date in case cost is rejected
                const originalDate = randomGame.date
                // choose random new date that works for both teams
                const randomOpenDate = selectRandomOpenDate(mutualOpenDates)
                editTeamSchedule(currentSchedule, randomGame, randomOpenDate)
                // calculate the cost of the schedule after the date change
                const cost = calculateScheduleCost(currentSchedule)
                // accept the change if the cost is reduced, otherwise undo the change
                if (cost < currentCost || Math.random() < Math.exp((currentCost - cost) / temperature)) {
                    currentCost = cost
                    updateTeamAvailableDates(teamAvailableDates, randomGame.home.name, randomGame.away.name, randomOpenDate, originalDate )
                } else {
                    editTeamSchedule(currentSchedule, randomGame, originalDate)
                }
            }
            temperature *= coolingRate
        }
        numIterations++
    }
    return bestSchedule
}