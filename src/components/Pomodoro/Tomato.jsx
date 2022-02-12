import React from "react";
import {AiFillPlayCircle, AiFillPauseCircle, AiOutlineRedo} from "react-icons/ai";
import "./Tomato.css";

function Tomato(props) {
  const {handleReset, handleStartStop, minutes, seconds, isRunning} = props;

  return (
    <div className='tomato'>
      <span className='timer-span'>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
      <div>
        <button id='start_stop' onClick={handleStartStop}>
          {isRunning ? (
            <AiFillPauseCircle size='40' color='rgb(48, 172, 251)' />
          ) : (
            <AiFillPlayCircle size='40' color='rgb(48, 172, 251)' />
          )}
        </button>
        <button id='reset' onClick={handleReset}>
          <AiOutlineRedo size='40' color='rgb(48, 172, 251)' />
        </button>
      </div>
    </div>
  );
}

export default Tomato;
