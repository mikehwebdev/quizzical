import React, { useState } from "react"
import he from 'he'

export default function Question({id, question, answers}){
{/* Each question component is passed a mapped over sub-array of answers contained in the question object in our original data, which it renders below.*/}

    return (
        <div className="question" key={id} >
                <h3 key={id}>{he.decode(question)}</h3>
                {answers}
        </div>
    )
}