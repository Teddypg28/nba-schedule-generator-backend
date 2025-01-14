import express from 'express'
import generateSchedule from './generateSchedule'
import getNumBackToBacks from './helpers/getNumBackToBacks'

import hillClimbing from './algorithms/hillClimbing'
import { Game, Matchup } from './types'
import simulatedAnnealing from './algorithms/simulatedAnnealing'
import getNumTriples from './helpers/getNumTriples'
import calculateDistance from './helpers/calculateDistance'
import { teams } from './teams'

const app = express()

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    let schedule: Game[] = []
    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();
    
    let initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)

    const optimizedSchedule = hillClimbing(initialSchedule)
    const optimizedSchedule2 = simulatedAnnealing(optimizedSchedule, 10000, 0.995)

    console.log(`Back to backs: ${getNumBackToBacks(optimizedSchedule2)}`)

    res.send(optimizedSchedule2.filter((game: any) => game.home === "Milwaukee Bucks" || game.away === "Milwaukee Bucks").sort((a: any, b: any) => new Date(a.date).valueOf() - new Date(b.date).valueOf()))
})

const d = calculateDistance(teams[0], teams[1])
console.log(d)