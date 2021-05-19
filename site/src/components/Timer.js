import React, { Fragment, useState, useEffect } from 'react';
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    generalLine: {
        display: 'inline-block',
        fontSize: '9pt',
        color: '#FF0000',
    },

}));

const Text = ({ time, ring }) => {

    const classes = useStyles();

    const [counter, setCounter] = useState(parseInt(time));


    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        if (counter <= 0) {
            ring();
        }
        return () => clearInterval(timer);
    }, [counter, ring]);

    return (
        <Fragment>
            {counter > 0 ?
                <Typography className={classes.generalLine}>
                    {`in ${parseInt(counter / 60)}m ${counter % 60}s`}
                </Typography>
                :
                <Typography className={classes.generalLine}>Completed!</Typography>
            }
        </Fragment>
    );

};

export default Text;