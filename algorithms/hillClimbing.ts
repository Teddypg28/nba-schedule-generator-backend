import { Game, Schedule, TeamAvailableDates } from "../types"

import getMutualOpenDates from "../helpers/getMutualOpenDates"
import getTeamAvailableDates from "../helpers/getTeamAvailableDates"
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates"
import calculateScheduleCost from "../helpers/calculateScheduleCost"

import { teams } from "../teams"

export default function hillClimbing(schedule: Schedule) {
    let iterations = 0
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Schedule = JSON.parse(JSON.stringify(schedule))
    let bestSchedule: Schedule = JSON.parse(JSON.stringify(currentSchedule))

    const teamAvailableDates: TeamAvailableDates = getTeamAvailableDates(schedule)

    while (iterations < 100000) {
        const randomTeam = teams[Math.floor(Math.random() * 30)]
        const randomTeamSchedule = currentSchedule[randomTeam.name]
        const randomGame = randomTeamSchedule[Math.floor(Math.random() * randomTeamSchedule.length)]
        
        const originalDate = randomGame.date
        const homeTeam = randomGame.home
        const awayTeam = randomGame.away

        const homeTeamScheduleGame = currentSchedule[homeTeam].find(game => game.id === randomGame.id) as Game
        const awayTeamScheduleGame = currentSchedule[awayTeam].find(game => game.id === randomGame.id) as Game

        const mutualOpenDates = getMutualOpenDates(randomGame.home, randomGame.away, teamAvailableDates)
        if (mutualOpenDates.length > 0) {
            const randomOpenDate = mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
            
            homeTeamScheduleGame.date = randomOpenDate
            awayTeamScheduleGame.date = randomOpenDate

            const cost = calculateScheduleCost(currentSchedule)
            if (cost < currentCost) {
                currentCost = cost
                bestSchedule = JSON.parse(JSON.stringify(currentSchedule))
                updateTeamAvailableDates(teamAvailableDates, homeTeam, awayTeam, randomOpenDate, originalDate)
            } 
            else {
                homeTeamScheduleGame.date = originalDate
                awayTeamScheduleGame.date = originalDate
            }
        }
        iterations++
    }
    return bestSchedule
}