import getSeasonDates from './helpers/getSeasonDates'
import { teams } from './teams'
import { Matchup, Schedule, Team } from './types'

/*
    3 Games Each Against 4 Conference Non Division Teams Explanation:
    
    In the first part of this function, our goal is to find 12 games total for each team against 4 conference, non-division opponents.
    It is important to note that we must keep the home/away balance for each team which can be tricky since we are dealing with an odd
    number of teams. 

    To solve this, for each conference, we grouped each of the 3 divisions. Then starting from the first division, each of those teams selects
    an opponent from the division next to it, and then they go onto select an opponent from the last division. At this point, the first division
    has 2 series' scheduled and the second and third have 1. So, to end the first loop, the second and third divisions match-make with each other 
    to balance out the number of series' each team is scheduled with (2). We then run the loop one more time so that each team has 4 series' (12 games total).

    To ensure that home/away games balance out for each team, whenever the "picking division" as we call it in the code is picking teams, if the
    division right next to the picking division is being selected from, those opponents will be given 2 away games and 1 home game, while the
    picking division teams are given 2 home games and 1 away game. Otherwise, it flips and 2 home games + 1 away game are given to the opponent
    and 2 away games + 1 home game are given to the picking division teams.

    Example:

    Division A: Team Blue
    Division B: Team Purple
    Division C: Team Green

    1) Blue (from picking division) matches with purple (directly next to picking division) (1 home game for blue, 1 away game for purple)
    2) Blue (from picking division) matches with green (not directly next to picking division) (1 away game for blue, 1 home game for green)
    3) Purple (now the picking division) matches with green (directly next to picking division) (1 home game for purple, 1 away game for green)

    Totals: 

    Blue: 1 away, 1 home
    Purple: 1 away, 1 home
    Green: 1 away, 1 home

    --- All Balance Out ---

    We run this code in the while loop until 6 home and 6 away games are achieved for each team, since certain random combos when selecting 
    may lead to a slight imbalance
*/

export default function generateSchedule(schedule: Schedule, selectedMatchups: Matchup[], gamesScheduled: Set<string>) {
    let equalHomeAwayGames = false
    while (!equalHomeAwayGames) {
        selectedMatchups = []
        gamesScheduled = new Set()
        for (let i = 0; i<2; i++) {
            [['Southeast', 'Atlantic', 'Central'], ['Northwest', 'Pacific', 'Southwest']].forEach(divisionSet => {
                for (let i = 0; i<divisionSet.length; i++) {
                    // These are the teams who will randomly pick their opponents from the other division(s)
                    const pickingDivisionTeams = teams.filter(team => team.division === divisionSet[i])
                    for (let a = i+1; a<divisionSet.length; a++) {
                        // These are the pools of teams that the picking divisions will select from
                        const selectableTeams = teams.filter(team => team.division === divisionSet[a])
                        const alreadySelectedTeams: string[] = []
                        pickingDivisionTeams.forEach(divisionTeam => {
                            const eligibleOpponents = selectableTeams.filter(team => !alreadySelectedTeams.includes(team.name) && !gamesScheduled.has([team.name, divisionTeam.name].sort().join('-')))
                            if (eligibleOpponents.length > 0) {
                                const randomIndex = Math.floor(Math.random() * eligibleOpponents.length)
                                const selectedOpponent = eligibleOpponents[randomIndex]
                                const matchupKey = [divisionTeam.name, selectedOpponent.name].sort().join('-')
                                gamesScheduled.add(matchupKey)
                                alreadySelectedTeams.push(selectedOpponent.name)
                                if (a === i + 1) {
                                    selectedMatchups.push(
                                        { home: divisionTeam, away: selectedOpponent },
                                        { home: selectedOpponent, away: divisionTeam },
                                        { home: divisionTeam, away: selectedOpponent }
                                    )
                                } else {
                                    selectedMatchups.push(
                                        { home: selectedOpponent, away: divisionTeam },
                                        { home: divisionTeam, away: selectedOpponent },
                                        { home: selectedOpponent, away: divisionTeam }
                                    )
                                }
                            }
                        })
                    }
                }
            })
        }
        if (teams.every(team => selectedMatchups.filter(matchup => matchup.home.name === team.name).length === 6 && selectedMatchups.filter(matchup => matchup.away.name === team.name).length)) {
            equalHomeAwayGames = true
        }
    }
    
    
    // 2 Games Each Against Opposing Conference Teams
    teams.forEach(team => {
        const opposingConferenceTeams = teams.filter(teamData => teamData.conference !== team.conference)
        opposingConferenceTeams.forEach(opposingTeam => {
            const matchupKey = [opposingTeam.name, team.name].sort().join('-')
            if (!gamesScheduled.has(matchupKey)) {
                selectedMatchups.push(
                    { home: team, away: opposingTeam },
                    { home: opposingTeam, away: team }
                )
                gamesScheduled.add(matchupKey)
            }
        })
    });
    
    // 6 Remaining Out of Division Conference Opponents
    ['Eastern', 'Western'].forEach(conference => {
        const conferenceTeams = teams.filter(team => team.conference === conference)
        conferenceTeams.forEach(conferenceTeam => {
            const teamSchedule = selectedMatchups.filter(matchup => matchup.home.name === conferenceTeam.name || matchup.away.name === conferenceTeam.name)
            const alreadyScheduledOpponents: string[] = []
            teamSchedule.forEach(match => {
                if (match.home.name !== conferenceTeam.name && match.home.conference === conference && match.home.division !== conferenceTeam.division && !alreadyScheduledOpponents.includes(match.home.name)) {
                    alreadyScheduledOpponents.push(match.home.name)
                } else if (match.away.name !== conferenceTeam.name && match.away.conference === conference && match.away.division !== conferenceTeam.division && !alreadyScheduledOpponents.includes(match.away.name)) {
                    alreadyScheduledOpponents.push(match.away.name)
                }
            })
            const conferenceOpponentsLeft: Team[] = []
            teams.forEach(team => {
                if (team.conference === conference && team.division !== conferenceTeam.division && !alreadyScheduledOpponents.includes(team.name)) {
                    conferenceOpponentsLeft.push(team)
                }
            })
            conferenceOpponentsLeft.forEach(opponent => {
                selectedMatchups.push(
                    { home: conferenceTeam, away: opponent },
                    { home: conferenceTeam, away: opponent },
                    { home: opponent, away: conferenceTeam },
                    { home: opponent, away: conferenceTeam }
                )
            })
        })
    })
    
    
    // 4 Other Division Opponents
    const divisions = ['Southeast', 'Atlantic', 'Central', 'Northwest', 'Pacific', 'Southwest']
    divisions.forEach(division => {
        const divisionTeams = teams.filter(team => team.division === division)
        for (let i = 0; i<divisionTeams.length; i++) {
            for (let t = i+1; t<divisionTeams.length; t++) {
                selectedMatchups.push(
                    { home: divisionTeams[i], away: divisionTeams[t] },
                    { home: divisionTeams[t], away: divisionTeams[i] },
                    { home: divisionTeams[i], away: divisionTeams[t] },
                    { home: divisionTeams[t], away: divisionTeams[i] }
                )
            }
        }
    })
    
    const dates = getSeasonDates()

    const teamScheduleOpenDates: {[key: string]: Set<string>} = {}

    teams.forEach(team => {
        teamScheduleOpenDates[team.name] = new Set()
        dates.forEach(date => {
            teamScheduleOpenDates[team.name].add(date)
        })
    })

    selectedMatchups.forEach((matchup: Matchup, index) => {
        const homeTeamOpenDates = Array.from(teamScheduleOpenDates[matchup.home.name])
        const awayTeamOpenDates = teamScheduleOpenDates[matchup.away.name]

        const commonOpenDates = homeTeamOpenDates.filter(date => awayTeamOpenDates.has(date))
        const randomOpenDate = commonOpenDates[Math.floor(Math.random() * commonOpenDates.length)]

        teamScheduleOpenDates[matchup.home.name].delete(randomOpenDate) 
        teamScheduleOpenDates[matchup.away.name].delete(randomOpenDate) 

        const gameObject = {
            id: index+1,
            home: matchup.home,
            away: matchup.away,
            arena: matchup.home.arena,
            date: randomOpenDate
        }

        schedule[matchup.away.name].push(gameObject)
        schedule[matchup.home.name].push(gameObject)
    })

    teams.forEach(team => schedule[team.name].sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()))

    return schedule
}