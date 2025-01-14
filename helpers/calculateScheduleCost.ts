import { Game } from "../types";
import getNumBackToBacks from "./getNumBackToBacks";
import getNumTriples from "./getNumTriples";

// returns the cost of a schedule (how "good" it is)
export default function calculateScheduleCost(schedule: Game[]) {
    const numTriples = getNumTriples(schedule)
    const numBackToBacks = getNumBackToBacks(schedule)
    return numBackToBacks
} 