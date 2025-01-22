import { Game, Schedule } from "../types"

export default function selectRandomGame(currentSchedule: Schedule) {
    const randomTeam = Object.keys(currentSchedule)[Math.floor(Math.random() * 30)]
    const randomTeamSchedule = currentSchedule[randomTeam]
    return randomTeamSchedule[Math.floor(Math.random() * randomTeamSchedule.length)]
}