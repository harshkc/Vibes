import React from "react";
import {AiFillPlusCircle, AiFillMinusCircle} from "react-icons/ai";

function LengthChanger(props) {
  const {name, handleDecrement, handleIncrement, length, label} = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: "1rem 0",
        textAlign: "center",
        fontSize: "20px",
      }}
    >
      <span>
        {label}
        <br />
        <strong>{length}</strong>
      </span>
      <div style={{margin: "0.5rem 0"}}>
        <button id={name + "-decrement"} onClick={handleDecrement}>
          <AiFillMinusCircle size={20} color='rgb(48, 172, 251)' />
        </button>
        <button id={name + "-increment"} onClick={handleIncrement}>
          <AiFillPlusCircle size={20} color='rgb(48, 172, 251)' />
        </button>
      </div>
    </div>
  );
}

export default LengthChanger;
