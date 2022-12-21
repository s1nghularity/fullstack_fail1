import { useRef, useState, useEffect, useContext } from 'react';
import {Card, CardBody, CardTitle, CardSubtitle,} from "reactstrap";
import AuthContext from "./context/authprovider";
import axios from './routes/api/axios';
import * as React from 'react'
import { Button } from '@mui/material';


const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, password, roles, accessToken });
            setUser('');
            setPassword('');
            setSuccess('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

  return (
    <>
      {success ? (
          <div>
              <h1>You are logged in!</h1>
              <p>
                <a href="home">Go to Home</a>
              </p>
          </div>
    ):(
      <div>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <Card className="alldatacard" style={{ width: "28rem"}}>
            <CardBody>
              <CardTitle tag="h5">Log in to your account!</CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  BB cannot be held responsible for any lost funds or account information.
                </CardSubtitle> 

                <form onSubmit={handleSubmit}>
                  <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <br />
                    <Button variant="outlined" size="small">Login</Button>
                </form>

            </CardBody>
          </Card>
            <p>
                Need an Account?<br />
              <span className="line">
                <Button variant ="outlined" color="success">
                  <a href="createaccount">Sign Up</a>
                </Button>   
              </span>
            </p>
      </div>
      )}
    </>
  );
};

export default Login;
