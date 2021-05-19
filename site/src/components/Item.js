import React, { Fragment } from 'react';
import { makeStyles, Avatar, Badge, withStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({


    item: {
        color: theme.palette.primary.main,
        float: 'left',
        padding: 5,
        background: theme.palette.primary.main,
        border: 1,
        borderStyle: 'solid',
        marginTop: 3,
        marginRight: 3,
        borderColor: theme.palette.primary.dark,

    },
    itemLarge: {
        width: 55,
        height: 55,
    },
    itemSmall: {
        width: 24,
        height: 24,
    },
    itemNewLine: {
        color: theme.palette.primary.main,
        float: 'left',
        padding: 5,
        background: theme.palette.primary.main,
        border: 1,
        borderStyle: 'solid',
        marginTop: 3,
        marginRight: 3,
        borderColor: theme.palette.primary.dark,
        clear: 'both'
    },

}));

const StyledBadge = withStyles((theme) => ({
    badge: {
        top: 35,
        right: 9,
        fontSize: '5pt',
    },
}))(Badge);

const StyledTooltip = withStyles({
    tooltipPlacementBottom: {
        margin: 0,
    },
    tooltipPlacementTop: {
        margin: 0,
    },
})(Tooltip);

const Item = (props) => {

    const classes = useStyles();

    return (
        <Fragment>
            <StyledTooltip title={props.item.title} arrow>
                <StyledBadge badgeContent={props.item.amount > 1 ? props.item.amount : 0}>
                    <Avatar variant="square"
                        className={`${props.newLine ? classes.item : classes.itemNewLine} ${props.size === 'large' ? classes.itemLarge : classes.itemSmall}`}
                        src={`https://static.tibia.com/images/charactertrade${props.item.img}`} alt={props.item.title} />
                </StyledBadge>
            </StyledTooltip>
        </Fragment>
    );

};

export default Item;