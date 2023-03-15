
export default function Summary({score, handleClick}) {
return (
    <div className='summary'>
        <h4>You scored {score}/5 correct answers</h4>
        <button className="play-again" onClick={handleClick}>Play again</button>
    </div>
)
}