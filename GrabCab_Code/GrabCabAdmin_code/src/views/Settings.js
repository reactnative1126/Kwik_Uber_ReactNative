import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {
    editSettings,
    clearSettingsViewError
}  from "../actions/settingsactions";

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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Settings = (props) => {
  const settingsdata = useSelector(state => state.settingsdata);
  const dispatch = useDispatch();
  const classes  = useStyles();
  const [data, setData] = useState({
      code:'USD',
      symbol:'$',
      cash:false,
      wallet:false,
      braintree:false,
      stripe:false
  });
  const [clicked, setClicked] = useState(false);

  useEffect(()=>{
    if(settingsdata.settings){
      setData(settingsdata.settings);
    }
  },[settingsdata.settings]);

  const handleSymbolChange = (e) =>{
    setData({...data, symbol:e.target.value});
  } 

  const handleCodeChange = (e) =>{
    setData({...data, code:e.target.value});
  }  

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };


  const handleSubmit = (e) =>{
    e.preventDefault();
    setClicked(true);
    dispatch(editSettings(data));
    alert("Updated");
  }

  const handleClose = () => {
    setClicked(false);
    dispatch(clearSettingsViewError());
  };

  return (
    settingsdata.loading? <CircularLoading/>:
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit}>
        <Typography component="h1" variant="h5">
          {languageJson.settings_title}
        </Typography>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="symbol"
              label={languageJson.currency_symbol}
              name="symbol"
              autoComplete="symbol"
              onChange={handleSymbolChange}
              value={data.symbol}
              autoFocus
          />
        <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="code"
              label={languageJson.currency_code}
              name="code"
              autoComplete="code"
              onChange={handleCodeChange}
              value={data.code}
          />
        <Typography component="h1" variant="h5" style={{marginTop:'30px'}}>
          {languageJson.payment_modes_title}
        </Typography>
          <FormControlLabel
                control={
                <Switch
                    checked={data.cash}
                    onChange={handleChange}
                    name="cash"
                    color="primary"
                />
                }
                label={languageJson.settings_label1}
          />
          <FormControlLabel
                control={
                <Switch
                    checked={data.wallet}
                    onChange={handleChange}
                    name="wallet"
                    color="primary"
                />
                }
              label={languageJson.settings_label2}
          />
          <FormControlLabel
                control={
                <Switch
                    checked={data.braintree}
                    onChange={handleChange}
                    name="braintree"
                    color="primary"
                />
                }
                label={languageJson.settings_label3}
            />
            <FormControlLabel
                control={
                <Switch
                    checked={data.stripe}
                    onChange={handleChange}
                    name="stripe"
                    color="primary"
                />
                }
                label={languageJson.settings_label4}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
          >
              {languageJson.submit}
          </Button>
        </form>
      </div>
      <AlertDialog open={settingsdata.error.flag && clicked} onClose={handleClose}>{languageJson.update_failed}</AlertDialog>
    </Container>
  );
  
}

export default Settings;
