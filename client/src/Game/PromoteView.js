import React from "react";

const PromoteView = ({promotion, callBackPromote, myColor}) => {

    const promotionPiece = {
        black:{knight:"♞", bishop:"♝", rook:"♜", queen:"♛"},
        white:{knight:"♘", bishop:"♗", rook:"♖", queen:"♕"}
    }

    const pickPromotion = promotion ? 
    <div id="promotion-div">
        <p>Promote</p>
        <button onClick={() => callBackPromote("rook")}>{promotionPiece[myColor].rook}</button>
        <button onClick={() => callBackPromote("bishop")}>{promotionPiece[myColor].bishop}</button>
        <button onClick={() => callBackPromote("knight")}>{promotionPiece[myColor].knight}</button>
        <button onClick={() => callBackPromote("queen")}>{promotionPiece[myColor].queen}</button>
    </div>
    :
    <></>
    return (
        <>
            {pickPromotion}
        </>
    )
}

export default PromoteView