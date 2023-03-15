import { useState } from 'react'
import Button from './Button'
import Question from './Question'
import Summary from './Summary'
import yellowBlob from '../src/img/yellowblob.png'
import purpleBlob from '../src/img/purpleblob.png'
import questionsYellowBlob from '../src/img/questionsyellowblob.png'
import questionsPurpleBlob from '../src/img/questionspurpleblob.png'
import data from '../data'
import './App.css'

function App() {
  
//All state we need for our Quizzical game.
  //gameStarted is set to false as our user starts the game themselves
  const [gameStarted, setGameStarted] = useState(false)
  //Game is not yet finished and we use this variable in conditionals when we're ready to calculate scores and display the 'Play again' button
  const [gameFinished, setGameFinished] = useState(false)
  //Our master data with a questions array with a sub answer array per question, a correct answer value to check scores when the game is finished and an identifier. The  answer array has a toggled value per answer entry.
  const [questionsArray,setQuestionsArray] = useState(data)
  //The score starts at 0 and is only calculated/changed in the game's final state.
  const [score, setScore] = useState(0)
  
//Starts the game!
function startGame(){
    setGameStarted(prev => !prev)
}

function buttonToggle(id, index) {
//We map over the main questions array here
    setQuestionsArray(prev => prev.map(question => {
//If the index of the question matches the id that's already inherited (when rendering the button out) we know that's the correct question in the array.
            if (index === question.id) {

                return {
                  //We return the question unchanged
                    ...question,
                    //but we map over the answer array that's embedded in our data to the question using the index that's passed by the button click/toggle 
                    answers: questionsArray[index].answers.map(answer => {
                      //if the answer held in the answers sub-array on this loop matches the id passed(which is essentially the answer in string form)
                        if (answer.answer === id){
                          //we return the answer but toggled true
                          return {
                            ...answer,
                            isToggled: true,
                        }
                        } else {
                          //otherwise we return the answer as toggled false so that when we click on an answer the other buttons are all unchecked for a logical user experience  
                            return {
                                ...answer,
                                isToggled: false,
                            }
                        }
                    })
                }
            } else {
              //If the question being returned by the original map isn't the one we clicked on the question is returned unchanged
                return question
            }
        })

    )
    
}

//The bulk of the visual info in the app. We map over the main questions array -
const questionsElements = questionsArray.map((question) => {
    return ( 
      <Question 
        //Unique key prop
        key={question.id}  
        //The index which we will use to help identify which questions answers to map over later in our buttonToggles conditional
        index={question.id}  
        //The main question text
        question={question.question}
        //We now have a sub-map of an answers array. I wasn't aware this was possible before I started this project and was a learning experience
        answers={question.answers.map(answer => {
          return (
            //We now map out each button
          <Button 
          //id is a string of the actual answer for using in conditionals
              id={answer.answer}
              //Index is passed to our buttonToggle function above
              index={question.id}
              //Unique key prop
              key={answer.answer}
              //the text for display in the button itself
              text={answer.answer}
              //handlClick fires off our buttonToggle function
              handleClick={buttonToggle}
              //Toggled status is used by the conditional in our classCalculator function to display the buttons status correctly to the user both during game and when the final answer check is fired off.
              isToggled={answer.isToggled}
              //gameFinished is a boolean used in our classCalculator function to render out buttons
              gameFinished={gameFinished}
              //The correct answer held against the parent question. Used in the classCalculator and in our checkAnswers function.
              correctAnswer={question.correctAnswer}
          />
        )})
      }
      />
  )})
  
//When the user finishes their game and wants to know their score they click 'Check answers'. This changes the game to finished for our conditionals so buttons get rendered correctly, loops over our questions, then over the answers sub array for that question to check if the answer being looped over is identical to the parent question's "Correct Answer value", and the answer has been toggled (clicked). If it has, one point is added to the users score.   

function checkAnswers() {
    setGameFinished(true)
    for (let question of questionsArray) {
        for (let answer of question.answers) {
            if (answer.answer === question.correctAnswer && answer.isToggled) {
                setScore(prev => prev + 1)
            }
        }
    }
}

//This function resets all values back to the game's original state when the user clicks 'Play again'. 
function restartGame(){
    setGameFinished(false)
    setGameStarted(false)
    setScore(0)
    setQuestionsArray(data)
}

  return (
    <div className="app">
      <div className="container">
        {/* The below images are rendered in the top and bottom corners. They are subtly different on each page so are rendered conditionally depending on if the game is started or not. */}
        <img className="blob-yellow" src={!gameStarted ? yellowBlob : questionsYellowBlob}/>
        <img className="blob-purple" src={!gameStarted ? purpleBlob : questionsPurpleBlob}/>
          {/* The below renders the start screen by default or the questions screen depending if the user has started the game and inverted the gameStarted value held in state. The questonsElements variable contains all questions and answers*/}
          {!gameStarted ? 
      <div className="start-screen">
        <h1>Quizzical</h1>
        <h2>A quick and easy quiz game</h2>
        <button onClick={startGame}>Start Quiz</button>
      </div>
      :
      <div className="questions">
        {questionsElements}
      </div>
      } 
      {/* If the game has started but not yet finished the user has the option to check their answers. Once they do this the score (held in state) and "Play again" button are displayed*/}
      <div className="footer">
        {gameStarted && !gameFinished && <button className="check-answers" onClick={checkAnswers}>Check answers</button>}
        {gameFinished &&
        <Summary 
          score={score}
          handleClick={restartGame}     
        />}
       </div>
      </div>
    </div>
  )
}

export default App
