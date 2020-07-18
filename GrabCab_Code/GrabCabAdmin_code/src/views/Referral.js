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

import {
    editBonus,
    clearReferralError
}  from "../actions/referralactions";

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

const Referral = (props) => {
  const referraldata = useSelector(state => state.referraldata);
  const dispatch = useDispatch();
  const classes  = useStyles();
  const [bonus, setBonus] = useState("");
  const [clicked, setClicked] = useState(false);

  useEffect(()=>{
    if(referraldata.bonus){
      setBonus(referraldata.bonus);
    }
  },[referraldata.bonus]);

  const handleBonusChange = (e) =>{
    setBonus(e.target.value);
  }  

  const handleSubmit = (e) =>{
    e.preventDefault();
    setClicked(true);
    dispatch(editBonus(parseFloat(bonus)));
  }

  const handleClose = () => {
    setClicked(false);
    dispatch(clearReferralError());
  };

  return (
    referraldata.loading? <CircularLoading/>:
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {languageJson.refferal_bonus}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="bonus"
              label={languageJson.refferal_bonus}
              name="bonus"
              autoComplete="bonus"
              onChange={handleBonusChange}
              value={bonus}
              autoFocus
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
      <AlertDialog open={referraldata.error.flag && clicked} onClose={handleClose}>{languageJson.update_failed}</AlertDialog>
    </Container>
  );
  
}

export default Referral;
