import React, {useEffect, useState, useRef} from "react";
import RainASMR from "../Sounds/rain.mp3";
import OceanASMR from "../Sounds/ocean.mp3";
import waves from "../images/waves.png";
import rain from "../images/rain.png";

const AdditionSettings = () => {
  const rainPlayer = useRef();
  const oceanPlayer = useRef();

  useEffect(() => {
    rainPlayer.current = new Audio(RainASMR);
    oceanPlayer.current = new Audio(OceanASMR);
  }, []);

  const [isRainPlaying, setRainPlaying] = useState(false);
  const [isOceanPlaying, setOceanPlaying] = useState(false);

  const toggleRainPlayer = () => {
    if (isRainPlaying) {
      rainPlayer.current.loop = false;
      rainPlayer.current.pause();
    } else {
      rainPlayer.current.play();
      rainPlayer.current.volume = 0.6;
      rainPlayer.current.loop = true;
    }

    setRainPlaying((prev) => !prev);
  };

  const toggleOceanPlayer = () => {
    if (isOceanPlaying) {
      oceanPlayer.current.loop = false;
      oceanPlayer.current.pause();
    } else {
      oceanPlayer.current.play();
      oceanPlayer.current.volume = 0.5;
      oceanPlayer.current.loop = true;
    }

    setOceanPlaying((prev) => !prev);
  };

  return (
    <div className='infoContainer'>
      <div style={{minWidth: "100%", height: "99%"}}></div>
      <div className='otherSoundsContainer'>
        <div className='allign' onClick={toggleRainPlayer}>
          <div className='otherSounds' style={!isRainPlaying ? {borderColor: "red"} : {}}>
            <img src={rain} className='imgSizing' alt='' />
          </div>
        </div>
        <div className='allign' onClick={toggleOceanPlayer}>
          <div className='otherSounds' style={!isOceanPlaying ? {borderColor: "red"} : {}}>
            <img src={waves} className='imgSizing' alt='' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionSettings;
