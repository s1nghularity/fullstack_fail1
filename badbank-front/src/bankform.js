import {useRef, useState, useEffect } from 'react'
import {Card, CardBody, CardTitle, CardSubtitle,} from "reactstrap";
import * as React from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button} from '@mui/material';

import axios from './routes/api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/createaccount';


//Register new users with username and password (hashed by controller) 

function BankForm({ label}) {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = React.useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchpwd, setMatchpwd] = React.useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidMatch(password === matchpwd);
  }, [matchpwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, password, matchpwd]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
    }
    try {
        const response = await axios.post(REGISTER_URL,
            JSON.stringify({ user, password }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        setSuccess(true);    
        setUser('');
        setPassword('');
        setMatchpwd('');
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Username Taken');
        } else {
            setErrMsg('Registration Failed')
        }
        errRef.current.focus();
    }
}

  return (
    <>
      {success ? (
        <div>
            <h1>Success!</h1>
            <p>
              <a href="login">Sign In</a>
            </p>
        </div>
    ) : (
    <div>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <Card className="alldatacard" style={{ width: "28rem"}}>
        <CardBody>
          <CardTitle tag="h5">{label}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              Please fill out the form below.
            </CardSubtitle>

            <form onSubmit={handleSubmit}>
              <label htmlFor="username" className="mb-3">
                Username:
                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon  icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
              </label>

              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />

              <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.<br />
              Must begin with a letter.<br />
              Letters, numbers, underscores, hyphens allowed.
              </p>


              <label htmlFor="password">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="passwordnote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            
              <p id="passworddnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
              </p>


              <label htmlFor="confirm_password">
                Confirm Password:
                <FontAwesomeIcon icon={faCheck} className={validMatch && matchpwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchpwd ? "hide" : "invalid"} />
              </label>
              <input
                type="password"
                id="confirm_password"
                onChange={(e) => setMatchpwd(e.target.value)}
                value={matchpwd}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>

            <Button variant = "contained" disabled={!validName || !validPassword || !validMatch ? true : false}>
            Sign Up
            </Button>            
            </form>

        </CardBody>
      </Card>
      <p>
        Already registered?<br />
        <span className="line">
        
          <Button variant="contained" color='warning'>
            
            <a href="login">Log back in.</a>
          </Button>
        </span>
      </p>
    </div>
    )}          
    </>
  );
};



export default BankForm;