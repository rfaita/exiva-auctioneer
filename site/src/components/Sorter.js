import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { makeStyles, withStyles, FormControl, RadioGroup, FormControlLabel, Radio, Switch } from '@material-ui/core';


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

const Sorter = (props) => {

    const classes = useStyles();



    return (
        <StyledMenu
            anchorEl={props.sorterAnchorEl}
            id={props.sorterId}
            keepMounted
            open={props.isSorterOpen}
            onClose={props.handleSorterClose}
        >

            <MenuItem className={classes.link} onClick={() => { props.handleSorterClose() }}>
                <FormControl component="fieldset">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={(props.sortOrder === 'desc')}
                                onChange={(e, value) => { props.handleSorterOrderChange(value ? 'desc' : 'asc') }}
                                name="sortOrder"
                            />
                        }
                        label={(props.sortOrder === 'asc' ? 'Ascending' : 'Descending')}
                    />
                    <RadioGroup aria-label="sort" name="sort1" value={props.sortType} onChange={(e, value) => { props.handleSorterChange(value) }}>
                        <FormControlLabel value="endDate" control={<Radio />} label="Auction End" />
                        <FormControlLabel value="level" control={<Radio />} label="Level" />
                        <FormControlLabel value="value" control={<Radio />} label="Price" />
                        <FormControlLabel value="valueAndBidded" control={<Radio />} label="Price (bidded only)" />
                    </RadioGroup>
                </FormControl>

            </MenuItem>



        </StyledMenu >
    );
}

export default Sorter;