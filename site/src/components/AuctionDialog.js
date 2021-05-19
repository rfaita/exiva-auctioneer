import React, { forwardRef } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';


import Slide from '@material-ui/core/Slide';
import AuctionComponent from './AuctionComponent';
import { LinearProgress, DialogContent, Fab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useAuction from '../hooks/useAuction';


const StyledDialog = withStyles((theme) => ({
    paperScrollBody: {
        background: 'none'
    },

}))(Dialog);


const useStyles = makeStyles((theme) => ({
    dialog: {
        padding: 0,
        background: 'none',
        backgroundColor: 'transparent',
    },
    dialogContent: {
        "&:nth-child(1)": {
            paddingTop: 0
        },
        background: 'none',
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        [theme.breakpoints.up('md')]: {
            "&:nth-child(1)": {
                paddingTop: 20
            },
            margin: 'auto',
            width: '80%',
        },
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    large: {
        width: theme.spacing(11),
        height: theme.spacing(11),
        marginRight: theme.spacing(3),
    },
    fab: {
        position: 'fixed',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
        zIndex: 99999
    },
}));

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AuctionDialog = (props) => {

    const classes = useStyles();

    const { loading, auction } = useAuction(props.auctionId);

    return (

        <StyledDialog scroll="body" className={classes.dialog} fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <DialogContent className={classes.dialogContent}>
                {!loading && <AuctionComponent auction={auction} />}
                {loading && <LinearProgress className={classes.loading} />}
                <Fab color="primary" className={classes.fab} onClick={props.handleClose} aria-label="close">
                    <CloseIcon />
                </Fab>
            </DialogContent>
        </StyledDialog>

    );

}

export default AuctionDialog;