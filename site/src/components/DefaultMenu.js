import React, { useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { Link, useHistory } from 'react-router-dom';
import { makeStyles, ListItemIcon, withStyles } from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { LoginContext } from '../providers/LoginProvider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { signOut } from '../services/Firebase';


const StyledMenu = withStyles((theme) => ({
    paper: {
        borderRadius: 0,
    },
    list: {
        border: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.dark,
        background: theme.palette.primary.main,
        borderRadius: 0,
    }
}))((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const useStyles = makeStyles((theme) => ({
    
    link: {
        fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
        color: theme.palette.primary.dark,
        textDecoration: 'underline'
    },
}));

const DefaultMenu = (props) => {

    const classes = useStyles();

    const { user } = useContext(LoginContext);
    const history = useHistory();

    return (
        <StyledMenu
            anchorEl={props.anchorEl}
            id={props.menuId}
            keepMounted
            open={props.isMenuOpen}
            onClose={props.handleMenuClose}
        >
            {!!user ?
                <MenuItem
                    className={classes.link} onClick={() => {
                        props.handleMenuClose();
                        signOut().then(() => history.push("/"));
                    }}>
                    <ListItemIcon>
                        <ExitToAppIcon /> Logout
                    </ListItemIcon>
                </MenuItem>
                :
                <Link className={classes.link} to={"/login"}>
                    <MenuItem onClick={props.handleMenuClose}>
                        <ListItemIcon>
                            <LockOpenIcon /> Login
                        </ListItemIcon>
                    </MenuItem>
                </Link>

            }
        </StyledMenu >
    );
}

export default DefaultMenu;