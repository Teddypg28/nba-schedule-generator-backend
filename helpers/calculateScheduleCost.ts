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

    teams.forEach(team => {
        let milesTraveled = 0
        let numTeamBackToBacks = 0
        
        const teamSchedule = schedule[team.name]
        const gameDates = teamSchedule.map(game => new Date(game.date).valueOf())

        teamSchedule.forEach((game, index) => {
            if (index < teamSchedule.length - 4) {
                // check for number of 5 home games in a row stretches
                const is5HomeGamesInRow = game.home.name === team.name
                    && teamSchedule.slice(index+1, index+5).every(g => g.home.name === team.name);
                if (is5HomeGamesInRow) num5HomeGamesInARow++;
                // check for number of 5 away games in a row stretches
                const is5AwayGamesInRow = game.away.name === team.name
                    && teamSchedule.slice(index+1, index+5).every(g => g.away.name === team.name);
                if (is5AwayGamesInRow) num5AwayGamesInARow++;
            }
            if (index < teamSchedule.length - 2 && Math.round((gameDates[index+2] - gameDates[index]) / (1000 * 3600 * 24)) === 2) {
                // check for number of triples
                numTriples++
            }
            if (index < teamSchedule.length - 1) {
                // check for number of back to backs
                const currentGame = gameDates[index]
                const nextGame = gameDates[index+1]
                if (((nextGame - currentGame) / (1000 * 3600 * 24)) <= 1) {
                    numBackToBacks++
                    numTeamBackToBacks++
                } 
                // check for number of miles traveled between games
                if (game.home.name !== team.name || teamSchedule[index+1].home.name !== team.name) {
                    const startingPoint = game.home
                    const destination = teamSchedule[index+1].home
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