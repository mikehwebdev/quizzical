import { useEffect, useState } from 'react'
import Button from './Button'
import Question from './Question'
import Summary from './Summary'
import yellowBlob from '../src/img/yellowblob.png'
import purpleBlob from '../src/img/purpleblob.png'
import questionsYellowBlob from '../src/img/questionsyellowblob.png'
import questionsPurpleBlob from '../src/img/questionspurpleblob.png'
import he from 'he'
import './App.css'

export default function App() {
  
//All state we need for our Quizzical game.

  //gameStarted is set to false as our user starts the game themselves
  const [gameStarted, setGameStarted] = useState(false)
  //Game is not yet finished and we use this variable in conditionals when we're ready to calculate scores and display the 'Play again' button
  const [gameFinished, setGameFinished] = useState(false)
  //Our master data with a questions array with a sub answer array per question, a correct answer value to check scores when the game is finished and an identifier. The  answer array has a toggled value per answer entry.
  const [questionsArray,setQuestionsArray] = useState([])
  //The score starts at 0 and is only calculated/changed in the game's final state.
  const [score, setScore] = useState(0)
  //While not displayed, gamesCompleted is tracked in useEffect below to ensure data is only fetched via the Open Trivia Database on the initial render, then if a new game is started
  const [gamesCompleted, setGamesCompleted] = useState(0)
  
//Starts the game!
function startGame(){
    setGameStarted(prev => !prev)
}

useEffect(() => {
  //The below URL is generated at https://opentdb.com/api_config.php
  fetch('https://opentdb.com/api.php?amount=5')
      .then(res => res.json())
      .then(data => {
          //After fetching the data I map I set the questionsArray with the incoming data which I map over passing in each question element and its index
          setQuestionsArray(data.results.map((question, index) => {
              //questions can be a True/False or multiple choice and can be identified by the "Type" value
              if (question.type === 'boolean') {
                  return {
                      //For "boolean" type questions we simply return an object that has the id, question, True and False buttons and the correctAnswer value . The checkAnswers function will work for both types of question.
                      question: question.question,
                      answers: [{
                          answer: "True",
                          isToggled: false
                      }, {
                          answer: "False",
                          isToggled: false
                      }],
                      correctAnswer: question.correct_answer,
                      id: index
                  }
              } else {
                  //For "multiple" type questions the correct answer and incorrect answers are seperate in the data so I need to insert the correct answer into the incorrect answers. First I need to generate a number between 0 and 3
                  let randomIndex = Math.floor(Math.random() * 4)
                  //The I can splice the the correct answer into the random location while ensuring not to replace any entry
                  question.incorrect_answers.splice(randomIndex, 0, question.correct_answer)
                  return {
                      question: question.question,
                      //Now we can map over the adjusted answers array and return 4 answers for our buttons - only one of which will match the correct answer
                      answers: question.incorrect_answers.map(answer => {
                          return {
                              answer: answer,
                              isToggled: false
                          }
                      }),
                      correctAnswer: question.correct_answer,
                      id: index
                  }
              }

          }))
      })
  //At the end of this process we now have a questionsArray with all data we need for our game and our Questions and Answers can be rendered.
}, [gamesCompleted])

function buttonToggle(id, index) {
  //We map over questionsArray here
  setQuestionsArray(prev => prev.map(question => {
          //If the index of the question matches the id that's already inherited (when rendering the button out) we know that's the correct question in the array.
          if (index === question.id) {

              return {
                  //We return the question unchanged
                  ...question,
                  //but we map over the answer array that's embedded in our data to the question using the index that's passed by the button click/toggle 
                  answers: questionsArray[index].answers.map(answer => {
                      //if the answer held in the answers sub-array on this loop matches the id passed(which is essentially the answer in string form)
                      if (answer.answer === id) {
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
          //id is a string of the actual answer for comparison purposes in conditionals
              id={answer.answer}
              //Index is passed to our buttonToggle function above
              index={question.id}
              //Unique key prop
              key={answer.answer}
              //the text for display in the button itself
              //Here we use he.decode to translate encoded HTML and ensure the answer data is displayed correctly
              text={he.decode(answer.answer)}
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

//This function resets all values back to the game's original state when the user clicks 'Play again' and sets the gamesCompleted to +1 to trigger our useEffect and fetch questions for the next round.
function restartGame(){
    setGameFinished(false)
    setGameStarted(false)
    setScore(0)
    setQuestionsArray([])
    setGamesCompleted(prev => prev +1)
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


