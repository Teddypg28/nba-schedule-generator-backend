export default function selectRandomOpenDate(mutualOpenDates: string[]) {
    return mutualOpenDates[Math.floor(Math.random() * mutualOpenDates.length)]
}