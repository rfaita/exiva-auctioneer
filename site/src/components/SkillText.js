import React from 'react';
import { makeStyles, Grid } from "@material-ui/core";
import LinearProgressWithLabel from './LinearPogressWithLabel';

const useStyles = makeStyles((theme) => ({
    skillsMaxLine: {
        paddingLeft: 3,
        fontSize: '9pt',
        background: theme.palette.primary.dark,
        color: theme.palette.primary.light,
        lineHeight: 1.5
    },
    skillsLine: {
        paddingLeft: 3,
        fontSize: '9pt',
        lineHeight: 1.5
    },
    skillsLineOdd: {
        paddingLeft: 3,
        fontSize: '9pt',
        background: theme.palette.primary.main,
        lineHeight: 1.5
    },
    skillsSpan: {
        fontWeight: 'bold',
        display: 'inline-block',
        width: 65
    },
    skillsData: {
        display: 'inline-block',
        width: 25
    },
}));

const SkillText = (props) => {

    const classes = useStyles();

    return (
        <div className={`${props.max ? classes.skillsMaxLine : props.odd ? classes.skillsLineOdd : classes.skillsLine}`}>
            <Grid container justify="flex-start">
                <Grid item>
                    <span className={classes.skillsSpan}>{props.label}: </span>
                </Grid>
                <Grid item>
                    <span className={classes.skillsData}>{props.value}</span>
                </Grid>
                <Grid item xs>
                    <LinearProgressWithLabel light={props.max} value={props.perc} />
                </Grid>
            </Grid>
        </div>
    );

};

export default SkillText;