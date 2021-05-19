import React, { useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useHistory } from 'react-router-dom';
import { LoginContext } from '../providers/LoginProvider';

import { signOut } from '../services/Firebase';
import { withStyles, ListItemIcon, makeStyles } from '@material-ui/core';

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


const MobileMenu = (props) => {

    const classes = useStyles();

    const { user } = useContext(LoginContext);
    const history = useHistory();

    return (
        <StyledMenu
            anchorEl={props.mobileMoreAnchorEl}
            id={props.menuId}
            keepMounted
            open={props.isMobileMenuOpen}
            onClose={props.handleMobileMenuClose}
        >
            {!!user ?
                <div>

                    <Link className={classes.link} to={"/login"}>
                        <MenuItem onClick={props.handleMobileMenuClose}>
                            <ListItemIcon>
                                <NotificationImportantIcon /> My Notifications
                            </ListItemIcon>
                        </MenuItem>
                    </Link>
                    <MenuItem
                        className={classes.link} onClick={() => {
                            props.handleMobileMenuClose();
                            signOut().then(() => history.push("/"));
                        }}>
                        <ListItemIcon>
                            <ExitToAppIcon /> Logout
                        </ListItemIcon>
                    </MenuItem>
                </div>
                :
                <Link className={classes.link} to={"/login"}>
                    <MenuItem onClick={props.handleMobileMenuClose}>
                        <ListItemIcon>
                            <LockOpenIcon /> Login
                        </ListItemIcon>
                    </MenuItem>
                </Link>
            }
        </StyledMenu>
    );
}

export default MobileMenu;