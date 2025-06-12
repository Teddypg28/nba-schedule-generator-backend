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

app.get('/schedule', (req, res) => {

    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const generatedSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)
    res.send(generatedSchedule["Milwaukee Bucks"])

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

    const result = { numBackToBacks, optimizedSchedule }

    res.send(result)
})

app.get('/sa/:temperature/:coolingRate/:iterations', (req, res) => {
    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const temperature = parseInt(req.params.temperature)
    const coolingRate = parseFloat(req.params.coolingRate)
    const iterations = parseInt(req.params.iterations)

    const initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)
    const optimizedSchedule = simulatedAnnealing(initialSchedule, temperature, coolingRate, iterations)

    const numBackToBacks = getNumBackToBacks(optimizedSchedule)

    const result = { numBackToBacks, optimizedSchedule }

    res.send(result)
})

app.get('/hc/:hcIterations/sa/:temperature/:coolingRate/:saIterations', (req, res) => {
    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const temperature = parseInt(req.params.temperature)
    const coolingRate = parseFloat(req.params.coolingRate)
    const saIterations = parseInt(req.params.saIterations)
    const hcIterations = parseInt(req.params.hcIterations)

    const initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)

    const hcOptimizedSchedule = hillClimbing(initialSchedule, hcIterations)
    const saOptimizedSchedule = simulatedAnnealing(hcOptimizedSchedule, temperature, coolingRate, saIterations)

    const numBackToBacks = getNumBackToBacks(saOptimizedSchedule)

    const result = { numBackToBacks, optimizedSchedule: saOptimizedSchedule }

    res.send(result)
})


