import React, {Component} from "react";
import "./Session.css";
import LengthChanger from "./LengthChanger";
import Tomato from "./Tomato";

class Session extends Component {
  constructor() {
    super();
    this.state = this.defaultState();
    this.tick = this.tick.bind(this);
    this.handleBreakTime = this.handleBreakTime.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);

    this.beepRef = React.createRef();
  }

  defaultState = () => {
    return {
      breakLength: 5,
      sessionLength: 25,
      isRunning: false,
      seconds: 0,
      minutes: 25,
      timerLabel: "Session",
      isBreak: false,
    };
  };

  handleSessionIncrement = () => {
    if (this.state.sessionLength < 60) {
      this.setSessionLength(this.state.sessionLength + 1);
    }
  };

  handleSessionDecrement = () => {
    if (this.state.sessionLength > 1) {
      this.setSessionLength(this.state.sessionLength - 1);
    }
  };

  handleBreakIncrement = () => {
    if (this.state.breakLength < 60) {
      this.setBreakLength(this.state.breakLength + 1);
    }
  };

  handleBreakDecrement = () => {
    if (this.state.breakLength > 1) {
      this.setBreakLength(this.state.breakLength - 1);
    }
  };

  setSessionLength = (newSessionLength) => {
    if (this.state.isBreak) {
      this.setState({
        sessionLength: newSessionLength,
      });
    } else {
      this.setState({
        sessionLength: newSessionLength,
        minutes: newSessionLength,
        seconds: 0,
      });
    }
  };

  setBreakLength = (newBreakLength) => {
    if (this.state.isBreak) {
      this.setState({
        breakLength: newBreakLength,
        minutes: newBreakLength,
        seconds: 0,
      });
    } else {
      this.setState({breakLength: newBreakLength});
    }
  };

  handleReset = () => {
    this.beepRef.current.load();
    this.setState(this.defaultState());
  };

  tick = () => {
    if (!this.state.isRunning) return;

    if (this.state.seconds > 0) {
      this.setState((state) => ({
        seconds: state.seconds - 1,
      }));
    } else if (this.state.minutes > 0) {
      this.setState((state) => ({
        minutes: state.minutes - 1,
        seconds: 59,
      }));
    } else {
      this.beepRef.current.play();
      this.handleBreakTime();
    }

    setTimeout(this.tick, 1000);
  };

  handleBreakTime = () => {
    if (this.state.isBreak) {
      this.setState({
        isRunning: true,
        seconds: 0,
        minutes: this.state.sessionLength,
        timerLabel: "Session",
        isBreak: false,
      });
    } else {
      this.setState((state) => ({
        isBreak: true,
        timerLabel: "Break",
        minutes: state.breakLength,
        seconds: 0,
      }));
    }
  };

  handleStartStop = () => {
    if (this.state.isRunning) {
      this.setState({
        isRunning: false,
      });
    } else {
      this.setState(
        {
          isRunning: true,
        },
        () => {
          setTimeout(this.tick, 1000);
        }
      );
    }
  };

  render() {
    return (
      <div className='pomApp'>
        <Tomato
          handleStartStop={this.handleStartStop}
          handleReset={this.handleReset}
          isRunning={this.state.isRunning}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
        />
        <div className='gridClass'>
          <LengthChanger
            name={"break"}
            className={"Break-length"}
            handleDecrement={this.handleBreakDecrement}
            handleIncrement={this.handleBreakIncrement}
            length={this.state.breakLength}
            label={"Break"}
          />
          <LengthChanger
            name={"session"}
            className={"Session-length"}
            handleDecrement={this.handleSessionDecrement}
            handleIncrement={this.handleSessionIncrement}
            length={this.state.sessionLength}
            label={"Session"}
          />
        </div>
        <audio
          id='beep'
          ref={this.beepRef}
          src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
        />
      </div>
    );
  }
}

export default Session;
