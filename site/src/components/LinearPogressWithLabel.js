import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';


const DarkBorderLinearProgress = withStyles((theme) => ({
    root: {
        marginTop: 5,
        height: theme.spacing(1),
    },
    colorPrimary: {
        background: 'none'
    },
    bar: {
        
        backgroundColor: theme.palette.primary.dark
    },
}))(LinearProgress);

const LightBorderLinearProgress = withStyles((theme) => ({
    root: {
        marginTop: 5,
        height: theme.spacing(1),
    },
    colorPrimary: {
        background: 'none'
    },
    bar: {
        backgroundColor: theme.palette.primary.ligth
    },
}))(LinearProgress);


export default function LinearWithValueLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                {!!props.light ?
                    <LightBorderLinearProgress variant="determinate" {...props} />
                    :
                    <DarkBorderLinearProgress variant="determinate" {...props} />
                }
            </Box>
        </Box>
    );
}