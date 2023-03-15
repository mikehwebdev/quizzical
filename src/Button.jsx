import React from "react";

export default function Button(props) {
    
{/*There are many states that the answer buttons can exist in for this app. I'm leveraging the capabilities of React here to dynamically assign a class according to what props ae assigned to the answer button to ensure the buttons look correct*/}

function classCalculator(answer){
    if  (answer.gameFinished && answer.correctAnswer === props.id) {
        return "answer-button selected correct"
    } else if (answer.isToggled && answer.gameFinished) {
        return "answer-button selected incorrect"
    } else if (!answer.isToggled && answer.gameFinished) {
        return "answer-button faded"
    } else  if (answer.isToggled) {
        return "answer-button selected" 
    } else {
        return "answer-button"
    }
}
    return (
        <>
        {/*The function passed down as handleClick is fed the id and index back which enables the correct rendering of the answer buttons */}
            <button className={classCalculator(props)} onClick={() => props.handleClick(props.id, props.index)}>{props.id}</button>
        </>
    )
}