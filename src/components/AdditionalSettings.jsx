import React, {useEffect, useState, useRef} from "react";
import RainASMR from "../Sounds/rain.mp3";
import OceanASMR from "../Sounds/ocean.mp3";
import waves from "../images/waves.png";
import youtube from "../images/youtube.png";
import rain from "../images/rain.png";
import {motion} from "framer-motion";

const AdditionSettings = ({radio, link}) => {
  const rainPlayer = useRef();
  const oceanPlayer = useRef();

  useEffect(() => {
    rainPlayer.current = new Audio(RainASMR);
    oceanPlayer.current = new Audio(OceanASMR);
  }, []);

  const [isRainPlaying, setRainPlaying] = useState(false);
  const [isOceanPlaying, setOceanPlaying] = useState(false);

  const [transitionValue, setTransitionValue] = useState(0);
  const [TitleLocation, setTitleLocation] = useState(350);

  const setTransition = () => {
    setTransitionValue(0);
  };

  const toggleRainPlayer = () => {
    if (isRainPlaying) {
      rainPlayer.current.loop = false;
      rainPlayer.current.pause();
    } else {
      rainPlayer.current.play();
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
      oceanPlayer.current.loop = true;
    }

    setOceanPlaying((prev) => !prev);
  };

  setTimeout(function () {
    setTransitionValue(-450); //Title Pop in and out
    setTitleLocation(420);
  }, 2000);

  useEffect(() => {
    setTransition();
    setTitleLocation(1000);
  }, [radio]);

  return (
    <div className='infoContainer'>
      <div className='songName'>
        <motion.div
          animate={{x: transitionValue}}
          transition={{delay: 1}}
          className='radioStationTitle'
          style={{left: TitleLocation}}
        >
          {radio}
          <a href={link} target='_blank' rel='noopener noreferrer' className='socialsContainer'>
            <img src={youtube} className='socialIcons' alt='' />
          </a>
        </motion.div>
      </div>
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
