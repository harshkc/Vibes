import React, {useEffect, useState} from "react";
import youtube from "../images/youtube.png";
import {motion} from "framer-motion";

const SongName = ({radio, link}) => {
  const [transitionValue, setTransitionValue] = useState(0);
  const [TitleLocation, setTitleLocation] = useState(350);

  const setTransition = () => {
    setTransitionValue(0);
  };

  useEffect(() => {
    setTransition();
    setTitleLocation(3000);
  }, [radio]);

  setTimeout(function () {
    setTransitionValue(-900); //Title Pop in and out
    setTitleLocation(840);
  }, 2000);

  return (
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
  );
};

export default SongName;
