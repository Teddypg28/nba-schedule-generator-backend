import { Schedule, TeamAvailableDates } from "../types";

import getTeamAvailableDates from "../helpers/getTeamAvailableDates";
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates";
import calculateScheduleCost from "../helpers/calculateScheduleCost";

import selectRandomGame from "../helpers/selectRandomGame";
import changeGameDate from "../helpers/changeGameDate";
import undoGameDateChange from "../helpers/undoGameDateChange";

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
            const { mutualOpenDates, awayTeamScheduleGame, homeTeamScheduleGame, originalDate } = selectRandomGame(currentSchedule, teamAvailableDates)
            if (mutualOpenDates.length > 0) {
                // change the date of the game to a random date
                const randomOpenDate = changeGameDate(mutualOpenDates, homeTeamScheduleGame, awayTeamScheduleGame, currentSchedule)
                // calculate the cost of the schedule after the date change
                const cost = calculateScheduleCost(currentSchedule)
                // accept the change if the cost is reduced, otherwise undo the change
                if (cost < currentCost || Math.random() < Math.exp((currentCost - cost) / temperature)) {
                    currentCost = cost
                    updateTeamAvailableDates(teamAvailableDates, homeTeamScheduleGame.home.name, awayTeamScheduleGame.away.name, randomOpenDate, originalDate )
                } else {
                    undoGameDateChange(homeTeamScheduleGame, awayTeamScheduleGame, originalDate, currentSchedule)
                }
            }
            temperature *= coolingRate
        }
        numIterations++
    }
    return bestSchedule
}