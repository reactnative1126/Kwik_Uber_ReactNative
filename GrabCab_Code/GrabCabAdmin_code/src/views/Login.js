import React,{ useState,useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import  languageJson  from "../config/language";
import {
  signIn,
  clearLoginError
}  from "../actions/authactions";

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width:192,
    height:192
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes  = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if(auth.info){
      props.history.push('/');
    }
  });

  const handleEmailChange = (e) =>{
    setEmail(e.target.value);
  }  

  const handlePasswordChange = (e) =>{
    setPassword(e.target.value);
  }  

  const handleSubmit = (e) =>{
    e.preventDefault();
    dispatch(signIn(email,password));
  }

  const handleClose = () => {
    setEmail("");
    setPassword("");
    dispatch(clearLoginError());
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src={logo} alt="Logo" />
        </Avatar>
        <Typography component="h1" variant="h5">
          {languageJson.sign_in}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={languageJson.email_address}
              name="email"
              autoComplete="email"
              onChange={handleEmailChange}
              value={email}
              autoFocus
          />
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={languageJson.password}
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
          >
              {languageJson.sign_in}
          </Button>
        </form>
      </div>
      <AlertDialog open={auth.error.flag} onClose={handleClose}>{languageJson.sign_in_error}</AlertDialog>
    </Container>
  );
  
}

export default Login;
