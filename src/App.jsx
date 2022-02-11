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
import LoginForm from "./components/LoginForm/LoginForm";
import {useAuth} from "./context/AuthProvider";
import {auth, db} from "./firebase";
import {signOut} from "firebase/auth";
import {defaultStations} from "./utils/defaultStations";
import {AiOutlinePlus} from "react-icons/ai";
import extractVideoId from "./utils/extractVideoId";
import VibeForm from "./components/VibeForm/VibeForm";

let lastPlayedVolume = 0;

function App() {
  const {user, setUser} = useAuth();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);

  const [theStations, setTheStations] = useState(defaultStations);
  const [video, setVideo] = useState(`//www.youtube.com/embed/TURbeWK2wwg?autoplay=1&mute=1&start=1`);
  const [streamingLink, setStreamingLink] = useState({
    link: "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl",
    name: "LofiGirl",
  });
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (user !== null) {
      console.log("hello");
    }
  });

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  const setMusicState = (link, name) => {
    const videoId = extractVideoId(link);
    setVideo(`//www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=1`);
    setStreamingLink({link, name});
    setIsStreaming(true);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    //find the index of object from theStations array which matches stationName
    const index = theStations.findIndex((station) => station.channelName === streamingLink.name);
    //if index is not -1, then set the music state to the next station
    setMusicState(theStations[index + 1].video, theStations[index + 1].channelName);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("BoostUser");
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVibeCheck = () => {
    if (!user) setIsShowLogin(true);
    else setShowModal((prev) => !prev);
  };

  return (
    <div className='interfaceContainer'>
      <div className='radioContainer'>
        <div className='logo'>Boosted</div>
        {user ? (
          <span onClick={logout} className='loginicon'>
            Logout
          </span>
        ) : (
          <span onClick={handleLoginClick} className='loginicon'>
            Login
          </span>
        )}

        <div className='subHeading'>Focus</div>
        <div className='radioStationsContainer'>
          <div className='radioList'>
            <motion.div
              whileHover={{scale: 1.09}}
              whileTap={{scale: 0.9}}
              onClick={handleVibeCheck}
              className='station'
              style={{margin: "0.5rem auto", padding: "0.2rem", border: "1px solid white"}}
            >
              <AiOutlinePlus />
              Add your favorites
            </motion.div>

            {theStations.map((station) => {
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
        {user && <VibeForm showModal={showModal} setShowModal={setShowModal} />}
        {!user && <LoginForm isShowLogin={isShowLogin} setShowLogin={setIsShowLogin} />}
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
