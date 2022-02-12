import React from "react";
import {useAuth} from "../../context/AuthProvider";
import extractVideoId from "../../utils/extractVideoId";
import {db} from "../../firebase";
import {doc, setDoc} from "firebase/firestore";

import "./vibeForm.css";

const VibeForm = ({showModal, setShowModal, addAStation}) => {
  const {user} = useAuth();
  const [error, setError] = React.useState(null);

  function matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  }

  const addStationToDB = async (station, id) => {
    try {
      await setDoc(doc(db, "users", user.id, "user_stations", id), station);
      addAStation(station);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const link = e.target.elements.link.value;
    const name = e.target.elements.name.value;

    //check first if its even a YT link
    const isYtLink = matchYoutubeUrl(link);
    if (!isYtLink) {
      setError("Please enter a YouTube link only");
      return;
    }
    //check the video exists
    const videoId = extractVideoId(link);
    var img = new Image();
    img.src = "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
    img.onload = function () {
      console.log(this.width + " " + this.height);
      //HACK a mq thumbnail has width of 320.
      //if the video does not exist(therefore thumbnail don't exist),
      // a default thumbnail of 120 width is returned.
      if (this.width === 120) {
        setError("Video does not exist");
        e.target.elements.link.value = "";
        return;
      }
      setError(null);
      const station = {
        link: link,
        name: name,
      };
      addStationToDB(station, videoId);
      setShowModal(false);
      // clear all the fields
      e.target.elements.link.value = "";
      e.target.elements.name.value = "";
    };
  };

  return (
    <div className={`${!showModal ? "active" : ""} show`}>
      <div className='login-form'>
        <div className='form-box solid'>
          <form onSubmit={handleSubmit}>
            <h1 className='login-text'>Add Your Vibe</h1>
            <label htmlFor='name'>Vibe name</label>
            <br></br>
            <input type='text' id='name' className='login-box' />
            <br></br>
            <label htmlFor='link'>Vibe link</label>
            <br></br>
            <input type='url' id='link' className='login-box' />
            <br></br>
            <input type='submit' value='ADD' className='login-btn' />
          </form>
          <p style={{color: "white", paddingBottom: "2rem"}}>
            *Currently we are only accepting YouTube links
          </p>
          {error && <p style={{color: "red", padding: "0.2 0"}}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VibeForm;
