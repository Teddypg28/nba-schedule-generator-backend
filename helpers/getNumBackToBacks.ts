import { Schedule } from "../types"

// returns the total number of back to backs in a given full NBA schedule (all teams or a specific team)
export default function getNumBackToBacks(schedule: Schedule, team?: string) {
    let numBackToBacks = 0
    const filteredTeams = team ? [team] : [...Object.keys(schedule).map(team => team)]
    filteredTeams.forEach(team => {
        const teamSchedule = Array.from(schedule[team]).sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
        for (let i = 0; i<teamSchedule.length - 1; i++) {
            const currentGame = new Date(teamSchedule[i].date).valueOf()
            const nextGame = new Date(teamSchedule[i+1].date).valueOf()
            if (((nextGame - currentGame) / (1000 * 3600 * 24)) <= 1) {
                numBackToBacks++
            } 
        }
    })
    return numBackToBacks
}