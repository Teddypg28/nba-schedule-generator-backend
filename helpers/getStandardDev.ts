// returns the standard deviation of a list of data points (back to backs, distance traveled)
export default function getStandardDev(list: number[]) {
    const mean = list.reduce((prevValue, currentValue) => prevValue + currentValue, 0) / list.length
    const variance = list.reduce((prevValue, currentValue) => prevValue + Math.pow(currentValue - mean, 2), 0) / list.length
    return Math.sqrt(variance)
}