import { Team } from "../types";

// returns distance between two teams
export default function calculateDistance(team1: Team, team2: Team) {
    const [team1Coordinates, team2Coordinates] = [team1.coordinates, team2.coordinates]
    // conversion from degrees to radians
    const φ1 = team1Coordinates.lat * Math.PI/180, 
          φ2 = team2Coordinates.lat * Math.PI/180, 
          Δλ = (team2Coordinates.lon-team1Coordinates.lon) * Math.PI/180, 
          R = 3959 // earth radius in miles

    const d = Math.acos(Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ)) * R
    return Math.round(d)
}
