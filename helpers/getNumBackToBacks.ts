import { teams } from "../teams"
import { Game } from "../types"

// returns the total number of back to backs in a given schedule
export default function getNumBackToBacks(schedule: Game[]) {
    let numBackToBacks = 0
    teams.forEach(team => {
        const teamSchedule = schedule.filter(game => game.home === team.name || game.away === team.name).sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
        teamSchedule.forEach((game, index) => {
            if (index < teamSchedule.length - 1) {
                const currentGame = new Date(game.date).valueOf()
                const nextGame = new Date(teamSchedule[index+1].date).valueOf()
                if (((nextGame - currentGame) / (1000 * 3600 * 24)) <= 1) {
                    numBackToBacks++
                }
            } 
        })
    })
    return numBackToBacks
}