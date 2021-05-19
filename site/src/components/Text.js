import React, { Fragment } from 'react';
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    generalLine: {
        paddingLeft: 3,
        fontSize: '9pt',
    },
    generalLineOdd: {
        paddingLeft: 3,
        fontSize: '9pt',
        background: theme.palette.primary.main,
    },
    generalSpan: {
        fontWeight: 'bold',
        display: 'inline-block',
        width: 110
    },
    generalSpanLarge: {
        fontWeight: 'bold',
        display: 'inline-block',
        width: 200
    },

}));

const Text = (props) => {

    const classes = useStyles();

    return (
        <Fragment>
            {!!props.label ?
                <Typography className={`${props.odd ? classes.generalLineOdd : classes.generalLine}`}>
                    <span className={`${props.size === 'large' ? classes.generalSpanLarge : classes.generalSpan}`}>{props.label}{!!props.showSeparator ? '' : ': '}</span>
                    {props.value}
                </Typography>
                :
                <Typography className={`${props.odd ? classes.generalLineOdd : classes.generalLine}`}>{props.value}</Typography>
            }
        </Fragment>
    );

};

export default Text;