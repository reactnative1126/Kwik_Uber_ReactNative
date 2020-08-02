import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';

function CircularLoading() {

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress/>
    </Grid>
  )
}

export default CircularLoading;