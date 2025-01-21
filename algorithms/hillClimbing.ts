import { Schedule, TeamAvailableDates } from "../types"

import getTeamAvailableDates from "../helpers/getTeamAvailableDates"
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates"
import calculateScheduleCost from "../helpers/calculateScheduleCost"

import selectRandomGame from "../helpers/selectRandomGame"
import changeGameDate from "../helpers/changeGameDate"
import undoGameDateChange from "../helpers/undoGameDateChange"

export default function hillClimbing(schedule: Schedule, numIterations: number) {
    let iterations = 0
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Schedule = structuredClone(schedule)
    let bestSchedule: Schedule = currentSchedule

    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)

    while (iterations < numIterations) {
        // select random game
        const { mutualOpenDates, awayTeamScheduleGame, homeTeamScheduleGame, originalDate } = selectRandomGame(currentSchedule, teamAvailableDates)
        if (mutualOpenDates.length > 0) {
            // change the date of the game to a random date
            const randomOpenDate = changeGameDate(mutualOpenDates, homeTeamScheduleGame, awayTeamScheduleGame, currentSchedule)
            // calculate the cost of the schedule after the date change
            const cost = calculateScheduleCost(currentSchedule)
            // accept the change if the cost is reduced, otherwise undo the change
            if (cost < currentCost) {
                currentCost = cost
                updateTeamAvailableDates(teamAvailableDates, homeTeamScheduleGame.home.name, awayTeamScheduleGame.away.name, randomOpenDate, originalDate )
            } else {
                undoGameDateChange(homeTeamScheduleGame, awayTeamScheduleGame, originalDate, currentSchedule)
            }
        }
        iterations++
    }
    return bestSchedule
}