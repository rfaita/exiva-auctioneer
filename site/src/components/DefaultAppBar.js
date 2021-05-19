import React, { useContext } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FilterListIcon from '@material-ui/icons/FilterList';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';

import { Link } from "react-router-dom";
import { Tooltip } from '@material-ui/core';
import { deepPurple, deepOrange, blue, cyan, green, red, yellow } from '@material-ui/core/colors';
import { LoginContext } from '../providers/LoginProvider';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';

const useStyles = makeStyles((theme) => ({
    logo: {
        height: 32,
        marginRight: 10,
        [theme.breakpoints.up('sm')]: {
            height: 34,
            marginRight: 0,
        },
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    appBar: {
        background: theme.palette.primary.main,
        minHeight: 44,
        borderLeft: 0,
        borderTop: 0,
        borderBottom: 1,
        borderRight: 0,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.dark,
        boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
        paddingLeft: theme.spacing(1),
    },
    avatarLogin: {
        width: theme.spacing(3),
        height: theme.spacing(3),

    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    blue: {
        color: theme.palette.getContrastText(blue[500]),
        backgroundColor: blue[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    cyan: {
        color: theme.palette.getContrastText(cyan[500]),
        backgroundColor: cyan[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    green: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    red: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    yellow: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}));

const DefaultAppBar = (props) => {

    const classes = useStyles();

    const { user } = useContext(LoginContext);

    const colors = ['deepPurple', 'deepOrange', 'blue', 'cyan', 'green', 'red', 'yellow'];

    const randomColor = () => {
        return colors[Math.floor((Math.random() * colors.length))];
    }

    return (
        <AppBar position="fixed" >
            <Toolbar className={classes.appBar}>
                <Link to={"/"}>
                    <img className={classes.logo} src="/imgs/logo.gif" alt="exiva auctioneer logo" />
                </Link>
                <div>
                    <IconButton variant="contained" onClick={props.handleDrawler}>
                        <FilterListIcon />
                    </IconButton>
                    <IconButton variant="contained" onClick={props.handleSorterOpen}>
                        <SortByAlphaIcon />
                    </IconButton>

                </div>

                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    {!!user &&
                        <div>
                            <Link to={`/notifications/${user.uid}`}>
                                <Tooltip title="Notifications" aria-label="trades">
                                    <IconButton aria-label="collection" color="inherit">
                                        <NotificationImportantIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </div>
                    }
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={props.menuId}
                        aria-haspopup="true"
                        onClick={props.handleProfileMenuOpen}
                        color="inherit"
                    >
                        {!!user ?
                            !!user.photoURL ?
                                <Avatar alt={user.displayName} src={user.photoURL} className={classes.avatarLogin} />
                                : <Avatar className={classes[randomColor()]}>{user.email.slice(0, 2).toUpperCase()}</Avatar>
                            : <AccountCircle />}
                    </IconButton>

                </div>
                <div className={classes.sectionMobile}>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={props.mobileMenuId}
                        aria-haspopup="true"
                        onClick={props.handleMobileMenuOpen}
                        color="inherit"
                    >
                        {!!user ?
                            !!user.photoURL ?
                                <Avatar alt={user.displayName} src={user.photoURL} className={classes.avatarLogin} />
                                : <Avatar className={classes[randomColor()]}>{user.email.slice(0, 2).toUpperCase()}</Avatar>
                            : <AccountCircle />}
                    </IconButton>
                </div>
            </Toolbar>



        </AppBar>

    );
}

export default DefaultAppBar;