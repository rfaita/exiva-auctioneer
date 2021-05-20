import React from 'react';
import { Grid, makeStyles, Typography, LinearProgress } from '@material-ui/core';
import AuctionItem from './AuctionItem';


const useStyles = makeStyles((theme) => ({
    loading: {
        background: theme.palette.primary.dark
    },
    sad: {
        marginRight: theme.spacing(1),
    },
    emptyMessage: {
        fontSize: 20,
        textAlign: 'center'
    }
}));

const AuctionGrid = (props) => {

    const classes = useStyles();


    return (
        <div>
            <div>
                {props.auctions.length > 0 ?
                    <div>
                        <Grid container spacing={2}>
                            {props.auctions.map((auction, index) => {
                                return (
                                    <Grid ref={props.auctions.length === index + 1 ? props.lastElementRef : null} item xs={12} sm={6} md={4} lg={3} key={auction._id} >
                                        <AuctionItem auction={auction} openDetailDialog={props.openDetailDialog} refreshAuctions={props.refreshAuctions} token={props.token}/>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                    :
                    <div>
                        {!props.loading &&
                            <Typography classsName={classes.emptyMessage} variant="body1">
                                {props.emptyMessage}
                            </Typography>}
                    </div>
                }
            </div>

            {props.loading && <LinearProgress className={classes.loading} />}
        </div>
    );
}

export default AuctionGrid;