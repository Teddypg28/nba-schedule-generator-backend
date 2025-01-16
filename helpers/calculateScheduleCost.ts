import { teams } from "../teams";
import { Game, Schedule } from "../types";
import calculateDistance from "./calculateDistance";

import calculateTotalScheduleDistance from "./calculateTotalScheduleDistance";
import getNumBackToBacks from "./getNumBackToBacks";
import getNumTriples from "./getNumTriples";
import getStandardDev from "./getStandardDev";

// returns the cost of a schedule (how "good" it is)
export default function calculateScheduleCost(schedule: Schedule) {

    let numTriples = 0
    let numBackToBacks = 0

    const numBackToBacksEachTeam: number[] = []
    const distanceTraveledEachTeam: number[] = []

    const teamsMap = Object.fromEntries(teams.map(team => [team.name, team]))

    teams.forEach(team => {
        let totalMilesTraveled = 0
        let numTeamBackToBacks = 0
        const teamSchedule = schedule[team.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())

        const gameDates = teamSchedule.map(game => new Date(game.date).valueOf())

        teamSchedule.forEach((game, index) => {
            if (index < teamSchedule.length - 2 && Math.round((gameDates[index+2] - gameDates[index]) / (1000 * 3600 * 24)) === 2) {
                numTriples++
            }
            if (index < teamSchedule.length - 1) {
                const currentGame = gameDates[index]
                const nextGame = gameDates[index+1]
                if (((nextGame - currentGame) / (1000 * 3600 * 24)) <= 1) {
                    numBackToBacks++
                    numTeamBackToBacks++
                } 
                if (game.home === team.name && teamSchedule[index+1].home === team.name) {
                    totalMilesTraveled += 0
                } else {
                    const startingPoint = teamsMap[game.home]
                    const destination = teamsMap[teamSchedule[index+1].home]
                    totalMilesTraveled += calculateDistance(startingPoint, destination)
                }
            }
        })
        numBackToBacksEachTeam.push(numTeamBackToBacks)
        distanceTraveledEachTeam.push(totalMilesTraveled)
    })

    const backToBacksStd = getStandardDev(numBackToBacksEachTeam)
    const distanceTraveledStd = getStandardDev(distanceTraveledEachTeam)

    const triplesWeight = 1000000
    const backToBacksWeight = 50000
    const backToBacksStdWeight = 5000

    return (numBackToBacks * backToBacksWeight) + (numTriples * triplesWeight) + ((backToBacksStd * backToBacksStdWeight) + distanceTraveledStd)
} 