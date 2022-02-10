import "./styles/index.css";
import "./styles/audioControl.css";
import React, {useState} from "react";
import AdditionSettings from "./components/additionalInfo";
import triangle from "./images/playBtn.png";
import github from "./images/github.png";
import play from "./images/playBtn.png";
import pauseImg from "./images/pause.png";
import volumeOn from "./images/volumeOn.png";
import loopImg from "./images/loop.png";
import mute from "./images/mute.png";
import {motion} from "framer-motion";
import ReactPlayer from "react-player";

let lastPlayedVolume = 0;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);

  const [video, setVideo] = useState(`//www.youtube.com/embed/TURbeWK2wwg?autoplay=1&mute=1&start=1`);
  const [streamingLink, setStreamingLink] = useState({
    link: "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl",
    name: "LofiGirl",
  });

  const defaultStations = [
    {
      video: "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl",
      channelName: "Lofi Girl",
    },
    {
      video: "https://www.youtube.com/watch?v=7NOSDKb0HlU&ab_channel=ChillhopMusic",
      channelName: "Chill Hop Music",
    },
    {
      video: "https://www.youtube.com/watch?v=dIdb_BWkZq4&ab_channel=AmbientRenders",
      channelName: "Ambient Renders",
    },
    {
      video: "https://www.youtube.com/watch?v=j28Oyq6NnOs&ab_channel=IvyStationRecords",
      channelName: "Ivy Records",
    },
    {
      video: "https://www.youtube.com/watch?v=w3LWHIz3bMc&ab_channel=nostalgic",
      channelName: "Anime Vibe",
    },
    {
      video: "https://www.youtube.com/watch?v=kgx4WGK0oNU&ab_channel=%E9%98%BF%E9%B2%8DAbao",
      channelName: "CloudHop",
    },
    {
      video: "https://www.youtube.com/watch?v=-9gEgshJUuY&ab_channel=lofigeek",
      channelName: "H5G1 Music",
    },
    {
      video: "https://www.youtube.com/watch?v=uxR_sTZnBtg&ab_channel=StudyMD",
      channelName: "StudyMD",
    },
    {
      video: "https://www.youtube.com/watch?v=xxgxkjV70Vc&ab_channel=NightrideFM",
      channelName: "Astral Throb",
    },
    {
      video: "https://www.youtube.com/watch?v=-5KAN9_CzSA&ab_channel=STEEZYASFUCK",
      channelName: "theJazz Cafe",
    },
  ];

  const setMusicState = (link, name) => {
    const videoId = link.split("=")[1].split("&")[0];
    setVideo(`//www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=1`);
    setStreamingLink({link, name});
    setIsStreaming(true);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    //find the index of object from defaultStations array which matches stationName
    const index = defaultStations.findIndex((station) => station.channelName === streamingLink.name);
    //if index is not -1, then set the music state to the next station
    setMusicState(defaultStations[index + 1].video, defaultStations[index + 1].channelName);
  };

  return (
    <div className='interfaceContainer'>
      <div className='radioContainer'>
        <div className='logo'>StudyBeats</div>
        <div className='subHeading'>Focus</div>
        <div className='radioStationsContainer'>
          <div className='radioList'>
            {defaultStations.map((station) => {
              return (
                <motion.div
                  key={station.channelName}
                  whileHover={{scale: 1.09}}
                  whileTap={{scale: 0.9}}
                  onClick={() => setMusicState(station.video, station.channelName)}
                  className='station'
                >
                  <img className='triangle' src={triangle} alt='' />
                  {station.channelName}
                </motion.div>
              );
            })}
          </div>
        </div>
        <a className='link github' href='https://github.com/harshkc'>
          <img className='githubLogo' src={github} alt='' /> Github
        </a>
      </div>
      <div className='audioControlContainer'>
        <div className='audioControl'>
          <motion.div
            whileHover={{scale: 1.09}}
            whileTap={{scale: 0.9}}
            className='volumeOn'
            style={{border: isLoop ? "1px solid green" : "1px solid white"}}
            onClick={() => setLoop(!isLoop)}
          >
            <img className='audioOnImg' src={loopImg} alt='loop' />
          </motion.div>
          <motion.div
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.9}}
            onClick={() => {
              setIsPlaying((prevState) => !prevState);
              setIsStreaming((prevState) => !prevState);
            }}
            className='playPause'
          >
            {isPlaying ? (
              <img className='playBtn2' src={pauseImg} alt='pause' />
            ) : (
              <img className='playBtn' src={play} alt='play' />
            )}
          </motion.div>
          <motion.div
            whileHover={{scale: 1.09}}
            whileTap={{scale: 0.9}}
            className='volumeOn'
            onClick={() => {
              if (!volume) {
                setVolume(lastPlayedVolume);
              } else {
                lastPlayedVolume = volume;
                setVolume(0);
              }
            }}
          >
            {!volume ? (
              <img className='audioOffImg' src={mute} alt='volume' />
            ) : (
              <img className='audioOnImg' src={volumeOn} alt='mute' />
            )}
          </motion.div>
          <div>
            <input
              className='volumeDial'
              type='range'
              min={0}
              max={1}
              value={volume}
              step={0.01}
              onChange={(event) => {
                setVolume(event.target.valueAsNumber);
              }}
            />
          </div>
        </div>
      </div>
      <div className={isPlaying ? "unpauseScreen" : "pauseScreen"}>
        <p style={{marginTop: "30rem"}}>Music Paused</p>
      </div>
      <AdditionSettings radio={streamingLink.name} />
      <div className='videoContainer'>
        <iframe
          className='vid'
          src={video}
          scrolling='no'
          mute='1'
          width='140%'
          height='140%'
          frameBorder='0'
          allow='accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          webkitallowfullscreen=''
          mozallowfullscreen=''
          allowFullScreen=''
        />
      </div>

      <ReactPlayer
        className='liveStreamPlayer'
        playing={isStreaming}
        volume={volume}
        url={streamingLink.link}
        onEnded={handleEnd}
        loop={isLoop}
      />

      <div className='loading'>
        <div className='container'>
          <div className='ring'></div>
          <div className='ring'></div>
          <div className='ring'></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
