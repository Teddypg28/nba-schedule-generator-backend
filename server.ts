import express from 'express'
import generateSchedule from './generateSchedule'
import getNumBackToBacks from './helpers/getNumBackToBacks'

import hillClimbing from './algorithms/hillClimbing'
import simulatedAnnealing from './algorithms/simulatedAnnealing'

import { Matchup, Schedule } from './types'
import { teams } from './teams'
import getNumTriples from './helpers/getNumTriples'

const PORT_NUMBER = 2828
const app = express()

app.listen(PORT_NUMBER, () => {
    console.log(`Server started on PORT ${PORT_NUMBER}`)
})

app.get('/', (req, res) => {
    let schedule: Schedule = {}
    teams.forEach(team => schedule[team.name] = [])

    let selectedMatchups: Matchup[] = []
    let gamesScheduled: Set<string> = new Set();

    const initialSchedule = generateSchedule(schedule, selectedMatchups, gamesScheduled)

    console.log(`Started...${new Date()}`)
    const optimizedSchedule = hillClimbing(initialSchedule)
    console.log(`Finished...${new Date()}`)

    console.log('Triples: ', getNumTriples(optimizedSchedule))
    console.log('Back to Backs: ', getNumBackToBacks(optimizedSchedule))

    res.send(optimizedSchedule['Milwaukee Bucks'])
})


