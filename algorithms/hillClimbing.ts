import { Game, Schedule, TeamAvailableDates } from "../types"

import getMutualOpenDates from "../helpers/getMutualOpenDates"
import getTeamAvailableDates from "../helpers/getTeamAvailableDates"
import updateTeamAvailableDates from "../helpers/updateTeamAvailableDates"
import calculateScheduleCost from "../helpers/calculateScheduleCost"

import { teams } from "../teams"

export default function hillClimbing(schedule: Schedule) {
    let iterations = 0
    let currentCost = calculateScheduleCost(schedule)
    let currentSchedule: Schedule = structuredClone(schedule)
    let bestSchedule: Schedule = structuredClone(currentSchedule)

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

            currentSchedule[homeTeam].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
            currentSchedule[awayTeam].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())

            const cost = calculateScheduleCost(currentSchedule)
            if (cost < currentCost) {
                currentCost = cost
                bestSchedule = structuredClone(currentSchedule)
                updateTeamAvailableDates(teamAvailableDates, homeTeam, awayTeam, randomOpenDate, originalDate)
            } 
            else {
                homeTeamScheduleGame.date = originalDate
                awayTeamScheduleGame.date = originalDate
                currentSchedule[homeTeam].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
                currentSchedule[awayTeam].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
            }
        }
        iterations++
    }
    return bestSchedule
}