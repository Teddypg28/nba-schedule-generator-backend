import { teams } from "../teams";
import { Schedule } from "../types";
import calculateDistance from "./calculateDistance";

import getStandardDev from "./getStandardDev";

// returns the cost of a schedule (how "good" it is)
export default function calculateScheduleCost(schedule: Schedule) {
    let numTriples = 0
    let numBackToBacks = 0
    let totalMilesTraveled = 0

    const numBackToBacksEachTeam: number[] = []
    const distanceTraveledEachTeam: number[] = []
    let num5HomeGamesInARow = 0
    let num5AwayGamesInARow = 0

    const teamsMap = Object.fromEntries(teams.map(team => [team.name, team]))

    teams.forEach(team => {
        let milesTraveled = 0
        let numTeamBackToBacks = 0
        
        const teamSchedule = schedule[team.name]
        const gameDates = teamSchedule.map(game => new Date(game.date).valueOf())

        teamSchedule.forEach((game, index) => {
            if (index < teamSchedule.length - 4) {
                if (game.home === team.name 
                    && teamSchedule[index+1].home === team.name 
                    && teamSchedule[index+2].home === team.name 
                    && teamSchedule[index+3].home === team.name 
                    && teamSchedule[index+4].home === team.name) {
                        num5HomeGamesInARow++
                }
                if (game.away === team.name 
                    && teamSchedule[index+1].away === team.name 
                    && teamSchedule[index+2].away === team.name 
                    && teamSchedule[index+3].away === team.name
                    && teamSchedule[index+4].away === team.name
                    ) {
                        num5AwayGamesInARow++
                }
            }
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
                    milesTraveled += 0
                } else {
                    const startingPoint = teamsMap[game.home]
                    const destination = teamsMap[teamSchedule[index+1].home]
                    const distance = calculateDistance(startingPoint, destination)
                    milesTraveled += distance
                    totalMilesTraveled += distance
                }
            }
        })
        numBackToBacksEachTeam.push(numTeamBackToBacks)
        distanceTraveledEachTeam.push(milesTraveled)
    })

    // standard deviations for number of back to backs and distance traveled per team to ensure it's even across the league
    const backToBacksStd = getStandardDev(numBackToBacksEachTeam)
    const distanceTraveledStd = getStandardDev(distanceTraveledEachTeam)

    // cost weights
    const triplesWeight = 1000000
    const backToBacksWeight = 50000
    const homeGamesInRowWeight = 40000
    const awayGamesInRowWeight = 40000
    const backToBacksStdWeight = 10000

    // takes into account number of triples, number of back to backs, number of 5 home/away games in a row for teams, total miles traveled per team, total miles traveled in entire schedule
    return (numBackToBacks * backToBacksWeight) + (numTriples * triplesWeight) + (num5AwayGamesInARow * awayGamesInRowWeight) + (num5HomeGamesInARow * homeGamesInRowWeight) + (backToBacksStd * backToBacksStdWeight) + distanceTraveledStd + totalMilesTraveled
} 