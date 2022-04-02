import React from "react";
import {useAuth} from "../../context/AuthProvider";
import {auth, db} from "../../firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {AiOutlineCloseCircle} from "react-icons/ai";

import "./loginform.css";

const LoginForm = ({isShowLogin, setShowLogin}) => {
  const {setUser} = useAuth();
  const [isRegister, setIsRegister] = React.useState(false);
  const [error, setError] = React.useState(null);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const createUser = async (authUser) => {
    const userSnapshot = await getDoc(doc(db, "users", authUser.id));
    if (userSnapshot.exists()) {
      setError("User already exists");
      return;
    } else {
      await setDoc(doc(db, "users", authUser.id), authUser);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);

    if (isRegister) {
      const password2 = e.target.elements.password2.value;
      if (password !== password2) {
        setError("Passwords do not match");
        return;
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            id: user.uid,
            email: user.email,
          };
          createUser(userData);
          localStorage.setItem("BoostUser", JSON.stringify(userData));
          setUser(userData);
          setShowLogin(false);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            id: user.uid,
            email: user.email,
          };
          localStorage.setItem("BoostUser", JSON.stringify(userData));
          setUser(userData);
          setShowLogin(false);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
    //clear all the fields
    e.target.elements.email.value = "";
    e.target.elements.password.value = "";
    isRegister ? (e.target.elements.password2.value = "") : null;
  };

  return (
    <div className={`${!isShowLogin ? "active" : ""} show`}>
      <div className='login-form'>
        <div className='form-box solid'>
          <form onSubmit={handleSubmit}>
            <h1 className='login-text'>{isRegister ? "Register" : "Login"}</h1>
            <div
              onClick={() => setShowLogin(false)}
              style={{position: "absolute", top: "5%", right: "5%", color: "white", cursor: "pointer"}}
            >
              <AiOutlineCloseCircle size={20} />
            </div>
            <label htmlFor='email'>Email</label>
            <br></br>
            <input type='email' id='email' className='login-box' />
            <br></br>
            <label htmlFor='password'>Password</label>
            <br></br>
            <input type='password' id='password' className='login-box' />
            <br></br>
            {isRegister && (
              <>
                <label htmlFor='password2'>Confirm Password</label>
                <br></br>
                <input type='password' id='password2' className='login-box' />
                <br></br>
              </>
            )}
            <input type='submit' value={isRegister ? "Register" : "Login"} className='login-btn' />
            {!isRegister && (
              <input
                type='button'
                value='Guest'
                className='guest-btn'
                onClick={() => {
                  let synEvent = {
                    preventDefault: () => {},
                    target: {
                      elements: {
                        email: {
                          value: "test@test.com",
                        },
                        password: {
                          value: "test@1234",
                        },
                      },
                    },
                  };
                  handleSubmit(synEvent);
                }}
              />
            )}
          </form>
          {isRegister ? (
            <div style={{color: "white", paddingBottom: "2rem"}}>
              Already have an account?{" "}
              <span
                style={{color: "rgb(48, 172, 251)", textDecoration: "underline", cursor: "pointer"}}
                onClick={() => setIsRegister(false)}
              >
                Login
              </span>
            </div>
          ) : (
            <div style={{color: "white", paddingBottom: "2rem"}}>
              {"Don't"} have an account?{" "}
              <span
                style={{color: "rgb(48, 172, 251)", textDecoration: "underline", cursor: "pointer"}}
                onClick={() => setIsRegister(true)}
              >
                Register
              </span>
            </div>
          )}
          {error && <p style={{color: "red"}}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
