This project provides a simple Express.js API that can be used to optimize automatically generated NBA schedules.

There are two endpoints for each algorithm that the code utilizes: hill climbing and simulated annealing.

The simulated annealing endpoints takes in 3 parameters --> /sa/:temperature/:coolingRate/:iterations
  - temperature: the initial temperature (Ex: 30000)
  - coolingRate: the rate at which the temperature cools (Ex: 0.9995)
  - iterations: the number of times to run the algorithm on a generated schedule (Ex: 3)

The hill climbing endpoint takes in 1 parameter --> /hc/:iterations
  - iterations: the number of times to run the loop before returning the optimized schedule (Ex: 200000)

Upon making a request to each endpoint:

1)  An NBA schedule that adheres to the following constraints for each NBA team is generated:
  - 4 games against the other 4 division opponents (4×4=16 games)
  - 4 games against 6 (out-of-division) conference opponents (4×6=24 games)
  - 3 games against the remaining 4 conference teams (3×4=12 games)
  - 2 games against teams in the opposing conference (2×15=30 games)
  - equal number of home/away games

2) That schedule is then optimized using a cost function to:
  - eliminate triples (back-to-back-to-back games for a single team)
  - reduce back-to-backs
  - reduce travel distance
  - reduce 5 home/away games in a row for teams
  - ensure that no team is signficantly traveling more or has significantly more back-to-backs than the other teams

Each endpoint returns an object displaying the number of back to backs the schedule has along with the optimized schedule.
