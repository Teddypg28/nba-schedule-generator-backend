import { Schedule, TeamAvailableDates } from "../types"

import getTeamAvailableDates from "../helpers/getTeamAvailableDates"
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates"
import calculateScheduleCost from "../helpers/calculateScheduleCost"

import selectRandomGame from "../helpers/selectRandomGame"
import getNewDate from "../helpers/getNewDate"
import getMutualOpenDates from "../helpers/getMutualOpenDates"
import editTeamSchedule from "../helpers/editTeamSchedule"

export default function hillClimbing(schedule: Schedule, numIterations: number) {
    let iterations = 0
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Schedule = structuredClone(schedule)
    let bestSchedule: Schedule = currentSchedule

    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)

    while (iterations < numIterations) {
        // select random game
        const randomGame = selectRandomGame(currentSchedule)
        const mutualOpenDates = getMutualOpenDates(randomGame.home.name, randomGame.away.name, teamAvailableDates)
        if (mutualOpenDates.length > 0) {
            // choose random new date that works for both teams
            const { randomOpenDate, originalDate } = getNewDate(mutualOpenDates, randomGame)
            editTeamSchedule(currentSchedule, randomGame, randomOpenDate)
            // calculate the cost of the schedule after the date change
            const cost = calculateScheduleCost(currentSchedule)
            // accept the change if the cost is reduced, otherwise undo the change
            if (cost < currentCost) {
                currentCost = cost
                updateTeamAvailableDates(teamAvailableDates, randomGame.home.name, randomGame.away.name, randomOpenDate, originalDate )
            } else {
                editTeamSchedule(currentSchedule, randomGame, originalDate)
            }
        }
        iterations++
    }
    return bestSchedule
}