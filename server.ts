import express from 'express'
import generateSchedule from './generateSchedule'

import hillClimbing from './algorithms/hillClimbing'
import simulatedAnnealing from './algorithms/simulatedAnnealing'

import { Matchup, Schedule } from './types'
import { teams } from './teams'
import getNumBackToBacks from './helpers/getNumBackToBacks'

const PORT_NUMBER = 8000
const app = express()

app.listen(PORT_NUMBER, () => {
    console.log(`Server started on PORT ${PORT_NUMBER}`)
})

app.get('/hc/:iterations', (req, res) => {
    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const numIterations = parseInt(req.params.iterations)

    const initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)
    const optimizedSchedule = hillClimbing(initialSchedule, numIterations)

    const numBackToBacks = getNumBackToBacks(optimizedSchedule)

    res.send(`${numBackToBacks} back to backs`)
})

app.get('/sa/:temperature/:coolingRate', (req, res) => {
    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const temperature = parseInt(req.params.temperature)
    const coolingRate = parseFloat(req.params.coolingRate)

    const initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)
    const optimizedSchedule = simulatedAnnealing(initialSchedule, temperature, coolingRate)

    const numBackToBacks = getNumBackToBacks(optimizedSchedule)

    res.send(`${numBackToBacks} back to backs`)
})



