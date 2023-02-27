const straightChecker = fiveUniqueNumberArray => {
    //only works properly if 5 unique valid numbers are inputted in an array
    const sortedSequence = fiveUniqueNumberArray.sort((a,b) => (b - a))
    if (
        parseInt(sortedSequence[0]) - parseInt(sortedSequence[4]) === 4 || 
        (parseInt(sortedSequence[0]) === 13 && parseInt(sortedSequence[1]) === 3) //ace 2 3 4 5 straight edge case
        ) return true
    else return false
}

const tallyMaker = fiveNumberArray => {
    const tallyObject = {}
    fiveNumberArray.forEach(number => {
        tallyObject[number] ? tallyObject[number] += 1 : tallyObject[number] = 1
    })
    return tallyObject
}

const evaluateHandTier = (fiveNumberArray, isFlush) => {
    // if (fiveNumberArray.length !== 5) return
    const tallyObject = tallyMaker(fiveNumberArray)

    if (Object.values(tallyObject).length === 5) {
        const isStraight = straightChecker(Object.keys(tallyObject))
        if (isFlush) {
            return isStraight ? 8 : 5 //straight flush = 8 , flush = 5
        }
        else {
            return isStraight ? 4 : 0 //straight = 4, no pairs = 0
        }
    }
    else if (Object.values(tallyObject).length === 4) {
        return 1 //one pair = 1
    }
    else if (Object.values(tallyObject).length === 3) {
        return Object.values(tallyObject).sort((a,b) => (b - a))[0] === 3 ? 3 : 2 //three of a kind = 3, two pairs = 2
    }
    else if (Object.values(tallyObject).length === 2) {
        return Object.values(tallyObject).sort((a,b) => (b - a))[0] === 4 ? 7 : 6 //four of a kind = 7, full house = 6
    } else return "error -- Invalid hand / input"
}

const tierScore = (uniqueNumberArray) => { //
    uniqueNumberArray = uniqueNumberArray.map(element => parseInt(element))
    const ascendingSort = uniqueNumberArray.sort((a,b) => (a - b))
    const score = ascendingSort.reduce((total, currentDigit, index) => {
        return (total + (currentDigit + 1) * 14 ** index)
    },0)
    return score
}

const bestHandSorter = (handObject1, handObject2) => { //returns 1 if input 1 is better, 0 if they are equal, -1 if input 2 is bigger
    const hand1 = handObject1.hand //a handObject has a hand key with an array of 5 numbers and a flush key boolean. example {hand:[0,1,2,3,4],flush:false}
    const hand2 = handObject2.hand
    const flush1 = handObject1.flush
    const flush2 = handObject2.flush
    const tierComparison = evaluateHandTier(hand1, flush1) - evaluateHandTier(hand2, flush2)
    if (tierComparison === 0) {
        const scoreComparison = tierScore(Object.keys(tallyMaker(hand1))) - tierScore(Object.keys(tallyMaker(hand2)))
        if (scoreComparison === 0) return 0
        else return (scoreComparison / Math.abs(scoreComparison))
    } else return (tierComparison / Math.abs(tierComparison))
}

console.log(bestHandSorter({hand:[13,12,11,10,9], flush:true}, {hand:[0,1,2,3,13], flush:true}))