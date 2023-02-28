//cards are from indexes by value from 2-ace to 0-12

const straightChecker = fiveUniqueNumberArray => {
    //only works properly if 5 unique valid numbers are inputted in an array
    const sortedSequence = fiveUniqueNumberArray.sort((a,b) => (b - a))
    if (
        parseInt(sortedSequence[0]) - parseInt(sortedSequence[4]) === 4 || 
        (parseInt(sortedSequence[0]) === 12 && parseInt(sortedSequence[1]) === 3) //ace 2 3 4 5 straight edge case
        ) return true
    else return false
}

export const tallyMaker = fiveNumberArray => {
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

const tierScore = (tallyObject) => {
    const uniqueNumberArray = Object.keys(tallyObject).map(element => parseInt(element))
    const ascendingSort = uniqueNumberArray.sort((a,b) => ((a + 14 ** tallyObject[a]) - (b + 14 ** tallyObject[b])))
    const score = ascendingSort.reduce((total, currentDigit, index) => {
        return (total + (currentDigit + 1) * 14 ** index)
    },0)
    return score
}

export const bestHandSorter = (handObject1, handObject2) => { //returns 1 if input 1 is better, 0 if they are equal, -1 if input 2 is bigger
    const hand1 = handObject1.hand //a handObject has a hand key with an array of 5 numbers and a flush key boolean. example {hand:[0,1,2,3,4],flush:false}
    const hand2 = handObject2.hand
    const flush1 = handObject1.flush
    const flush2 = handObject2.flush
    const tierComparison = evaluateHandTier(hand1, flush1) - evaluateHandTier(hand2, flush2)
    if (tierComparison === 0) {
        const scoreComparison = tierScore(tallyMaker(hand1)) - tierScore(tallyMaker(hand2))
        if (scoreComparison === 0) return 0
        else return (scoreComparison / Math.abs(scoreComparison))
    } else return (tierComparison / Math.abs(tierComparison))
}

export const inputValid = inputString => {
    let lowString = inputString.toLowerCase()
    lowString = lowString.replace(/\s+/g, '') //should remove whitespace
    const stringTally = tallyMaker(lowString.split("").slice(0,5))
    const validCharacter = char => ["2","3","4","5","6","7","8","9","t","j","q","k","a"].includes(char)
    
    if (![5,6].includes(lowString.length))                             return false //has to be 5-6 chars
    if (lowString.length === 6 && lowString[5] !== "f")                return false //6th char has to be 'f'
    if (!lowString.slice(0,5).split("").every(validCharacter))         return false //no invalid chars plz
    if (Object.keys(stringTally) === 1)                                return false //no 5 of kind plz
    if (lowString[5] === "f" && Object.keys(stringTally).length !== 5) return false //no same suit pairs plz
    return true
}

export const translateMove = validInput => {
    validInput = validInput.toLowerCase()
    validInput = validInput.replace(/\s+/g, '')
    const cardToIndex = {"2":0,"3":1,"4":2,"5":3,"6":4,"7":5,"8":6,"9":7,"t":8,"j":9,"q":10,"k":11,"a":12}
    const fiveCardHand = validInput.slice(0,5).split("").map(char => cardToIndex[char])
    const handObject = {hand:fiveCardHand, flush:validInput[5] === 'f'}
    return handObject
}

export const prettyHand = handObject => {
    const indexToCard = {0:"2", 1:"3", 2:"4", 3:"5", 4:"6", 5:"7", 6:"8", 7:"9", 8:"T", 9:"J", 10:"Q", 11:"K", 12:"A"}
    const tallyHand = tallyMaker(handObject.hand)
    //fixing so 5432A straight doesn't show up as A5432
    if (handObject.hand.every(card => [0,1,2,3,12].includes(card)) && Object.keys(tallyHand).length === 5) return "5432A"
    const orderedHand = handObject.hand.sort((a,b) => ((13 ** tallyHand[b] + b) - (13 ** tallyHand[a] + a)))
    const cardArray = orderedHand.map(index => indexToCard[index])
    let move = cardArray.join("")
    move = handObject.flush ? move + "F" : move
    return move
}

const suitDivider = cardArray => {
    const suitObject = {}
    cardArray.forEach(card => {
        const suitIndex = Math.floor(card/13) 
        suitObject[suitIndex] ? suitObject[suitIndex].push(card % 13) : suitObject[suitIndex] = [card % 13]
    })
    return suitObject
}

export const validateHand = (handObject, cardArray) => {
    let returnValue
    if (handObject.flush) { 
        const suitObject = suitDivider(cardArray)  //split cardArray into arrays separated by suits 
        returnValue = !!Object.values(suitObject).find(suitArray => { //check all suit arrays if there is one that contains all my cards 
            return handObject.hand.every(card => (suitArray.includes(card)))
            })
    } else {
        const unsuitedCardArray = cardArray.map(card => card % 13)
        returnValue = handObject.hand.every(card => {
            const match = unsuitedCardArray.find(match => match === card)
            if (match) {
                unsuitedCardArray.splice(unsuitedCardArray.indexOf(match),1)
                return true
            }
        })
    }
    console.log(returnValue)
    return returnValue 
}