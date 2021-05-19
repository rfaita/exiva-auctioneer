import React, { Fragment } from 'react';
import AuctionComponent from '../components/AuctionComponent';
import { useParams } from 'react-router-dom';
import useAuction from '../hooks/useAuction';
import { LinearProgress, makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    loading: {
        background: theme.palette.primary.dark
    }
}));

export default function Auction() {

    const classes = useStyles();

    let { auctionId } = useParams();

    const { loading, auction } = useAuction(auctionId);

    return (
        <Fragment>
            {!loading && <AuctionComponent auction={auction} />}
            {loading && <LinearProgress className={classes.loading} />}
        </Fragment>

    );
}