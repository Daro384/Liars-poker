class Piece {
    constructor(move, color) {
        this.move = move
        this.color = color
        this.happy = true
    }
    talk(){
        console.log("Hello")
    }
}

class Pawn extends Piece{
    constructor(move, color){
        super(move, color)
        this.enPassant = true
    }
    talk(){
        console.log("I am in crippling debt")
    }

    promoteToQueen(){
        return new Queen(2, "white")
    }
}

class Queen extends Piece{
    talk() {
        console.log("Kneel children")
    }
}

const classArray = {pawn:new Pawn(2,"white")}

let firstPawn = classArray.pawn

firstPawn = firstPawn.promoteToQueen()
classArray.pawn.talk()