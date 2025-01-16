import { teams } from "../teams"
import { Game, Schedule, TeamAvailableDates } from "../types"
import getSeasonDates from "./getSeasonDates"

// loops through each team's schedule and then returns a global object that holds the dates that are open for each team for swapping purposes
export default function getTeamAvailableDates(schedule: Schedule) {
    const teamAvailableDates: TeamAvailableDates = {}
    const fullSeasonDates = getSeasonDates()
    teams.forEach(team => {
        const teamSchedule = schedule[team.name]
        const gameDates = teamSchedule.map(game => game.date)
        const filteredDates = gameDates.filter((date, index) => gameDates.indexOf(date) === index)
        const availableDates = fullSeasonDates.filter(date => !filteredDates.includes(date))
        teamAvailableDates[team.name] = new Set(availableDates)
    })
    return teamAvailableDates
}