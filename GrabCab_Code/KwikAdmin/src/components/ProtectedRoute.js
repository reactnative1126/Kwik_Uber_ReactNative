import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import { useSelector } from "react-redux";
import ResponsiveDrawer from './ResponsiveDrawer';

function ProtectedRoute({ component: Component, ...rest }) {
    const auth = useSelector(state => state.auth);
    return(
        <Route {...rest} render={props => (
            auth.info ?
            <ResponsiveDrawer><Component {...props} /></ResponsiveDrawer>
            : <Redirect to="/login" />
        )} />
    )
}

export default ProtectedRoute;