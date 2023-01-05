import { useEffect, useState } from "react";
import "./style.scss";
import MoleImg from "./mole.png";
import MoleHitImg from "./moleHit.png";

function App() {
  //地鼠狀態
  let [moles, setMoles] = useState(
    [
      {id: 0, status: "hide"},
      {id: 1, status: "hide"},
      {id: 2, status: "hide"},
      {id: 3, status: "hide"},
      {id: 4, status: "hide"},
      {id: 5, status: "hide"},
      {id: 6, status: "hide"},
      {id: 7, status: "hide"},
      {id: 8, status: "hide"},
    ]
  );

  //分數
  let [score, setScore] = useState(0);
  //遊戲時間
  let [gameTime, setGameTime] = useState(10);
  //遊戲狀態
  let [gamePlay, setGamePlay] = useState(false);
  //紀錄上次的index
  let [prevIdx, setPrevIdx] = useState(null);
  
  //遊玩狀態改變
  useEffect(() => {
    if(gamePlay){
      countDown();
    }else{
      allMoleHide();
    }
  },[gamePlay])

  useEffect(() => {
    const allStatus = moles.map(mole => Object.values(mole)[1]);
    if(!allStatus.includes("show") && gamePlay){
      moleShow();
    }
  },[moles, gamePlay])

  //地鼠停留時間
  function randomTime(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min) * 300
  }

  //隨機地鼠
  function randomIndex(){
    const curIdx = Math.floor(Math.random() * moles.length);
    if(curIdx === prevIdx){
      return randomIndex();
    }else{
      setPrevIdx(curIdx);
      return curIdx;
    }
  }

  //新的地鼠出現
  function moleShow(){
    const showIdx = randomIndex();
    const showTime = randomTime(2, 4);
    let newMoles = [...moles];
    newMoles[showIdx].status = "show";
    setMoles(newMoles);
    //時間到消失
    setTimeout(() => {
      let newMoles = [...moles];
      if(moles[showIdx].status !== "hit"){
        newMoles[showIdx].status = "hide";
        setMoles(newMoles);
      }
    },showTime);
  }

  //全部地鼠停止
  function allMoleHide(){
    let initMoles = [...moles];
    initMoles.forEach(mole => mole.status = "hide");
    setMoles(initMoles);
  }

  //點擊地鼠
  function clickMole(idx){
    let newMoles = [...moles];
    newMoles[idx].status = "hit";
    setMoles(newMoles);
    setScore(score + 1);
  }

  //報數計時
  function countDown(){
    const timer = setInterval(() => {
      if(gameTime === 0){
        setGamePlay(false);
        clearInterval(timer);
      }else{
        setGameTime(gameTime -= 1);
      }
    }, 1000);
  }
  //開始遊戲
  function startGame(){
    setGameTime(10);
    setScore(0);
    setGamePlay(true);
  }


  return (
    <div className="game">
      <div className="game__board">
        <div className="game__time">時間: {gameTime}</div>
        <div className="game__score">分數: {score}</div>
      </div>
      <section className="game__section">
        {moles.map((mole, idx) => (
          <div key={idx} className="game__item">
            <div 
              className={`mole ${mole.status==='show'?'mole--show':mole.status==='hit'?'mole--hit':''}`}
              onClick={() => clickMole(idx)}
            >
              <img src={mole.status === "hit"?MoleHitImg:MoleImg} alt="地鼠" />
            </div>
            <div className="hole"></div>
          </div>
        ))}
      </section>
      <button
        className={`game__btn ${gamePlay?'game__btn--hide':''}`}
        onClick={() => startGame()}>START
      </button>
    </div>
  );
}

export default App;
