export interface TeamAvailableDates {
    [key: string]: Set<string>
}

export interface Schedule {
    [key: string]: Game[]
}

export interface Game {
    id: number
    home: Team,
    away: Team,
    date: string,
    arena: Team['stadium']
}

export interface Team {
    name: string,
    division: string,
    conference: string,
    stadium: string,
    coordinates: {lat: number, lon: number}
}

export interface Matchup {
    home: Team,
    away: Team
}