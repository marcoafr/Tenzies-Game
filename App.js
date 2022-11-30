import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollsNumber, setRollsNumber] = React.useState(0);
  // Getting rolls record from local storage, if there is, if not, 100000 by default
  const [rollsRecord, setRollsRecord] = React.useState(
    () => JSON.parse(localStorage.getItem("rollsRecord")) || 100000
  );
  const [matchTime, setMatchTime] = React.useState(0);
  // Getting time record from local storage, if there is, if not, 100000 by default
  const [timeRecord, setTimeRecord] = React.useState(
    () => JSON.parse(localStorage.getItem("timeRecord")) || 100000
  );
  const [initialTime, setInitialTime] = React.useState(new Date());

  // Saving records to local storage, only if they change! - Time Record
  React.useEffect(() => {
    localStorage.setItem("timeRecord", JSON.stringify(timeRecord));
  }, [timeRecord]);

  // Saving rolls to local storage, only if they change! - Rolls Record
  React.useEffect(() => {
    localStorage.setItem("rollsRecord", JSON.stringify(rollsRecord));
  }, [rollsRecord]);

  // Match Time Follow
  React.useEffect(() => {
    if (!tenzies) {
      const interval = setInterval((a) => {
        setMatchTime(Math.round((new Date() - initialTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setMatchTime(matchTime);
    }
  }, [tenzies]);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      // If number of rolls record is greater than actual number of rolls, set new record
      if (rollsRecord > rollsNumber) {
        const finalNumber = rollsNumber;
        setRollsRecord(finalNumber);
      }
      // It time record is greater than actual number of rolls, set new record
      if (timeRecord > matchTime) {
        setTimeRecord(matchTime);
      }
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      // Adding the number
      setRollsNumber((prevNumber) => prevNumber + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      // Establishing initial conditions for the game to start
      setTenzies(false);
      setDice(allNewDice());
      setRollsNumber(0);
      setInitialTime(new Date());
      setMatchTime(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id
          ? { value: die.value, id: die.id, isHeld: !die.isHeld }
          : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="records">
        Number of Rolls: {rollsNumber} / Record:{" "}
        {rollsRecord === 100000 ? "n/a" : rollsRecord}
      </p>
      <p className="records">
        Match time: {matchTime} sec/ Record:{" "}
        {timeRecord === 100000 ? "n/a" : `${timeRecord} sec`}
      </p>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <p>By: Marco Ribeiro - Scrimba React Course Exercise</p>
    </main>
  );
}
