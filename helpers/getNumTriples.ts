import { teams } from "../teams"
import { Game, Schedule } from "../types"

// returns the number of back to back to back games in a given schedule
export default function getNumTriples(schedule: Schedule) {
    let numTriples = 0
    teams.forEach(team => {
        const teamSchedule = schedule[team.name]
        teamSchedule.forEach((game, index) => {
            if (index < teamSchedule.length - 2 && Math.round((new Date(teamSchedule[index+2].date).valueOf() - new Date(game.date).valueOf()) / (1000 * 3600 * 24)) === 2) {
                numTriples++
            }
        })
    })
    return numTriples
}