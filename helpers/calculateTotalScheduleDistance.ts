import { teams } from "../teams";
import { Game, Schedule, Team } from "../types";
import calculateDistance from "./calculateDistance";

// returns the total distance a team travels in its schedule in miles
export default function calculateTotalScheduleDistance(schedule: Schedule, team: string) {
    const teamSchedule = schedule[team]
    const teamsMap = Object.fromEntries(teams.map(team => [team.name, team]))
    let totalDistanceTraveled = 0
    teamSchedule.forEach((game, index) => {
        if (index < teamSchedule.length - 1) {
            if (game.home.name === team && teamSchedule[index+1].home.name === team) {
                totalDistanceTraveled += 0
            } else {
                const startingPoint = teamsMap[game.home.name]
                const destination = teamsMap[teamSchedule[index+1].home.name]
                totalDistanceTraveled += calculateDistance(startingPoint, destination)
            }
        }
    })
    return totalDistanceTraveled
}