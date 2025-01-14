export interface TeamAvailableDates {
    [key: string]: Set<string>
}

export interface Game {
    home: Team['name'],
    away: Team['name'],
    date: string,
    arena: Team['stadium'],
    time: string
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