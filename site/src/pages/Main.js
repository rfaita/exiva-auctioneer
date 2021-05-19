import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import {
    Route, Switch,
    withRouter, useLocation
} from "react-router-dom";
import DefaultAppBar from '../components/DefaultAppBar';
import DefaultMenu from '../components/DefaultMenu';
import MobileMenu from '../components/MobileMenu';
import Sorter from '../components/Sorter';
import { onMessageListener } from '../services/Firebase';
import Auction from './Auction';
import Auctions from './Auctions';
import Login from './Login';
import SignUp from './SignUp';
import { initGA, pageView } from '../services/tracking';
import Filter from '../components/Filter';



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

    main: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(7),
        flexGrow: 1,
    },
    drawer: {
        marginTop: 48,
        width: drawerWidth,
        flexShrink: 0,
        [theme.breakpoints.up('md')]: {
            marginTop: 56,
        },
    },
    drawerPaper: {
        marginTop: 48,
        width: drawerWidth,
        flexShrink: 0,
        [theme.breakpoints.up('md')]: {
            marginTop: 56,
        },
        background: theme.palette.primary.main,
        borderLeft: 0,
        borderTop: 1,
        borderBottom: 1,
        borderRight: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.dark,
        boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
        color: theme.palette.primary.dark,
    },
    content: {
        flexGrow: 1,
        padding: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
        },
    },
    formControl: {
        minWidth: 170,
    },
    iconControl: {
        minWidth: 44,
    },
    iconControlHidden: {
        minWidth: 44,
        color: theme.palette.primary.main,
    },
    labelControl: {
        width: '100%',
        color: theme.palette.primary.dark,
        margin: 0,

    },
    githubLink: {
        color: theme.palette.primary.dark,
        fontWeight: 'bold'
    },
    labelControlSkillType: {
        width: '50%',
        color: theme.palette.primary.dark,
        margin: 0,
    },
    inputControl: {
        color: theme.palette.primary.dark,
    },
    resetButton: {
        width: '100%',
        margin: 0,
        padding: 0,
    },

}));

const Main = () => {
    const classes = useStyles();


    const location = useLocation();

    useEffect(() => {
        initGA();
        pageView({ pathname: '/', search: '' });
    }, []);

    useEffect(() => {
        console.log(location);
        pageView(location);
    }, [location])



    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [sorterAnchorEl, setSorterAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isSorterOpen = Boolean(sorterAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleSorterOpen = (event) => {
        setSorterAnchorEl(event.currentTarget);
    };

    const handleSorterClose = () => {
        setSorterAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const [open, setOpen] = React.useState(false);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const [sortType, setSortType] = useState('endDate');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSorterOrderChange = (sortOrder) => {
        setSortOrder(sortOrder);
    }

    const handleSorterChange = (sortType) => {
        setSortType(sortType);
    }

    const { enqueueSnackbar } = useSnackbar();

    onMessageListener().then(payload => {
        enqueueSnackbar(payload.data.title + ' ' + payload.data.body);

        console.log(payload);
    }).catch(err => console.log('failed: ', err));


    return (
        <Fragment>
            <Filter open={open} sortType={sortType} setSortType={setSortType} sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <div className={clsx(classes.content, { [classes.contentShift]: open })}>
                <DefaultAppBar menuId={menuId} mobileMenuId={mobileMenuId} handleDrawler={handleDrawer} handleSorterOpen={handleSorterOpen}
                    handleMobileMenuOpen={handleMobileMenuOpen} handleProfileMenuOpen={handleProfileMenuOpen}

                />
                <Sorter handleSorterOpen={handleSorterOpen} sortType={sortType}
                    sorterAnchorEl={sorterAnchorEl} isSorterOpen={isSorterOpen} sortOrder={sortOrder}
                    handleSorterClose={handleSorterClose} handleSorterChange={handleSorterChange}
                    handleSorterOrderChange={handleSorterOrderChange}
                />
                <MobileMenu mobileMenuId={mobileMenuId} handleMobileMenuOpen={handleMobileMenuOpen}
                    mobileMoreAnchorEl={mobileMoreAnchorEl} isMobileMenuOpen={isMobileMenuOpen}
                    handleMobileMenuClose={handleMobileMenuClose}
                />
                <DefaultMenu menuId={menuId} handleProfileMenuOpen={handleProfileMenuOpen}
                    anchorEl={anchorEl} isMenuOpen={isMenuOpen}
                    handleMenuClose={handleMenuClose}
                />
                <div className={classes.main}>
                    <Switch>
                        <Route exact path="/">
                            <Auctions />
                        </Route>
                        <Route path="/auctions">
                            <Auctions />
                        </Route>

                        <Route path="/auction/:auctionId">
                            <Auction />
                        </Route>

                        <Route path="/login">
                            <Login />
                        </Route>

                        <Route path="/signup">
                            <SignUp />
                        </Route>

                    </Switch>
                </div>
            </div >
        </Fragment>
    );
}

export default withRouter(Main)