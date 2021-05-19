import {
    Button, Divider, Drawer,
    FormControl, FormControlLabel, List, ListItem, ListItemIcon, MenuItem,
    Select, Slider, Typography, Checkbox, Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import PublicIcon from '@material-ui/icons/Public';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useEffect, useState } from 'react';
import parseQuery from '../helper/QueryParser';
import { useHistory } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

    
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

const Filter = (props) => {

    const classes = useStyles();

    const history = useHistory();

    const [server, setServer] = useState('All');
    const [level, setLevel] = useState(0);
    const [levelDisplay, setLevelDisplay] = useState(0);
    const [maxLevel, setMaxLevel] = useState(9999);
    const [maxLevelDisplay, setMaxLevelDisplay] = useState(2000);
    const [skillValue, setSkillValue] = useState(0);
    const [skillValueDisplay, setSkillValueDisplay] = useState(0);
    const [value, setValue] = useState(0);
    const [valueDisplay, setValueDisplay] = useState(0);
    const [maxValue, setMaxValue] = useState(999999);
    const [maxValueDisplay, setMaxValueDisplay] = useState(100000);
    const [skillType, setSkillType] = useState('');
    


    useEffect(() => {

        let q = '';
        if (!!server && server !== 'All') {
            q += `server ${server} `;
        }
        if (!!level && level > 0) {
            q += `level > ${level} `;
        }
        if (!!maxLevel && maxLevel < 9999) {
            q += `level < ${maxLevel} `;
        }
        if (!!value && value > 0) {
            q += `value > ${value} `;
        }
        if (!!maxValue && maxValue < 999999) {
            q += `value < ${maxValue} `;
        }
        if (!!skillType && !!skillValue && skillValue > 0) {
            q += `${skillType} > ${skillValue} `;
        }

        if (!q && props.sortType !== 'endDate') {
            q = 'value 0';
        }

        if (!q && props.sortOrder !== 'asc') {
            q = 'value 0';
        }

        if (!!q) {

            try {

                const parsedQuery = parseQuery(q);
                history.push(`/auctions?q=${escape(JSON.stringify(parsedQuery))}&st=${props.sortType}&so=${props.sortOrder}`);

            } catch (e) {
                console.log(e);
            }
        }

    }, [server, level, maxLevel, skillValue, value, maxValue, skillType, props.sortType, props.sortOrder, history]);

    const resetFilters = () => {
        setServer('All');
        setLevel(0);
        setLevelDisplay(0);
        setValue(0);
        setValueDisplay(0);
        setMaxLevel(9999);
        setMaxLevelDisplay(2000);
        setMaxValue(999999);
        setMaxValueDisplay(100000);
        setSkillType('');
        setSkillValue(0);
        setSkillValueDisplay(0);
        props.setSortType('endDate');
        props.setSortOrder('asc');

        const parsedQuery = parseQuery('value 0');
        history.push(`/auctions?q=${escape(JSON.stringify(parsedQuery))}&st=endDate&so=asc`);
    }


    return (
        <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <List>

                    <ListItem>
                        <Button
                            color="secondary"
                            onClick={resetFilters}
                            className={classes.resetButton}
                            startIcon={<RotateLeftIcon />}
                        >
                            Reset Filter
                        </Button>

                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <PublicIcon />
                        </ListItemIcon>
                        <Typography id="world-select-label" component="div" className={classes.labelControl} gutterBottom>World
                        </Typography>
                        <Select onChange={(e) => { setServer(e.target.value) }}
                            className={classes.inputControl} value={server}

                            id="world-select"
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            <MenuItem value={'Adra'}>Adra</MenuItem>
                            <MenuItem value={'Antica'}>Antica</MenuItem>
                            <MenuItem value={'Astera'}>Astera</MenuItem>
                            <MenuItem value={'Belobra'}>Belobra</MenuItem>
                            <MenuItem value={'Bona'}>Bona</MenuItem>
                            <MenuItem value={'Calmera'}>Calmera</MenuItem>
                            <MenuItem value={'Carnera'}>Carnera</MenuItem>
                            <MenuItem value={'Celebra'}>Celebra</MenuItem>
                            <MenuItem value={'Celesta'}>Celesta</MenuItem>
                            <MenuItem value={'Concorda'}>Concorda</MenuItem>
                            <MenuItem value={'Damora'}>Damora</MenuItem>
                            <MenuItem value={'Descubra'}>Descubra</MenuItem>
                            <MenuItem value={'Dibra'}>Dibra</MenuItem>
                            <MenuItem value={'Emera'}>Emera</MenuItem>
                            <MenuItem value={'Epoca'}>Epoca</MenuItem>
                            <MenuItem value={'Estela'}>Estela</MenuItem>
                            <MenuItem value={'Fera'}>Fera</MenuItem>
                            <MenuItem value={'Ferobra'}>Ferobra</MenuItem>
                            <MenuItem value={'Fervora'}>Fervora</MenuItem>
                            <MenuItem value={'Firmera'}>Firmera</MenuItem>
                            <MenuItem value={'Garnera'}>Garnera</MenuItem>
                            <MenuItem value={'Gentebra'}>Gentebra</MenuItem>
                            <MenuItem value={'Gladera'}>Gladera</MenuItem>
                            <MenuItem value={'Harmonia'}>Harmonia</MenuItem>
                            <MenuItem value={'Honbra'}>Honbra</MenuItem>
                            <MenuItem value={'Impera'}>Impera</MenuItem>
                            <MenuItem value={'Inabra'}>Inabra</MenuItem>
                            <MenuItem value={'Javibra'}>Javibra</MenuItem>
                            <MenuItem value={'Juva'}>Juva</MenuItem>
                            <MenuItem value={'Kalibra'}>Kalibra</MenuItem>
                            <MenuItem value={'Karna'}>Karna</MenuItem>
                            <MenuItem value={'Kenora'}>Kenora</MenuItem>
                            <MenuItem value={'Libertabra'}>Libertabra</MenuItem>
                            <MenuItem value={'Lobera'}>Lobera</MenuItem>
                            <MenuItem value={'Luminera'}>Luminera</MenuItem>
                            <MenuItem value={'Lutabra'}>Lutabra</MenuItem>
                            <MenuItem value={'Menera'}>Menera</MenuItem>
                            <MenuItem value={'Mercera'}>Mercera</MenuItem>
                            <MenuItem value={'Mitigera'}>Mitigera</MenuItem>
                            <MenuItem value={'Monza'}>Monza</MenuItem>
                            <MenuItem value={'Mudabra'}>Mudabra</MenuItem>
                            <MenuItem value={'Nefera'}>Nefera</MenuItem>
                            <MenuItem value={'Nexa'}>Nexa</MenuItem>
                            <MenuItem value={'Nossobra'}>Nossobra</MenuItem>
                            <MenuItem value={'Ombra'}>Ombra</MenuItem>
                            <MenuItem value={'Optera'}>Optera</MenuItem>
                            <MenuItem value={'Pacembra'}>Pacembra</MenuItem>
                            <MenuItem value={'Pacera'}>Pacera</MenuItem>
                            <MenuItem value={'Peloria'}>Peloria</MenuItem>
                            <MenuItem value={'Premia'}>Premia</MenuItem>
                            <MenuItem value={'Quelibra'}>Quelibra</MenuItem>
                            <MenuItem value={'Quintera'}>Quintera</MenuItem>
                            <MenuItem value={'Ragna'}>Ragna</MenuItem>
                            <MenuItem value={'Refugia'}>Refugia</MenuItem>
                            <MenuItem value={'Reinobra'}>Reinobra</MenuItem>
                            <MenuItem value={'Relania'}>Relania</MenuItem>
                            <MenuItem value={'Relembra'}>Relembra</MenuItem>
                            <MenuItem value={'Secura'}>Secura</MenuItem>
                            <MenuItem value={'Serdebra'}>Serdebra</MenuItem>
                            <MenuItem value={'Serenebra'}>Serenebra</MenuItem>
                            <MenuItem value={'Solidera'}>Solidera</MenuItem>
                            <MenuItem value={'Talera'}>Talera</MenuItem>
                            <MenuItem value={'Unica'}>Unica</MenuItem>
                            <MenuItem value={'Unisera'}>Unisera</MenuItem>
                            <MenuItem value={'Utobra'}>Utobra</MenuItem>
                            <MenuItem value={'Venebra'}>Venebra</MenuItem>
                            <MenuItem value={'Visabra'}>Visabra</MenuItem>
                            <MenuItem value={'Vunira'}>Vunira</MenuItem>
                            <MenuItem value={'Wintera'}>Wintera</MenuItem>
                            <MenuItem value={'Wizera'}>Wizera</MenuItem>
                            <MenuItem value={'Xandebra'}>Xandebra</MenuItem>
                            <MenuItem value={'Xylona'}>Xylona</MenuItem>
                            <MenuItem value={'Yonabra'}>Yonabra</MenuItem>
                            <MenuItem value={'Ysolera'}>Ysolera</MenuItem>
                            <MenuItem value={'Zenobra'}>Zenobra</MenuItem>
                            <MenuItem value={'Zuna'}>Zuna</MenuItem>
                            <MenuItem value={'Zunera'}>Zunera</MenuItem>

                        </Select>

                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <SwapVertIcon />
                        </ListItemIcon>

                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            {`Level ${levelDisplay}`}
                            <Slider className={classes.inputControl} value={levelDisplay} onChange={(e, newValue) => { setLevelDisplay(newValue) }} onChangeCommitted={(e, newValue) => { setLevel(newValue) }}
                                min={0} max={1000} step={100}
                                id="level-select"
                            />
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon className={classes.iconControlHidden}>
                            <SwapVertIcon />
                        </ListItemIcon>
                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            {`Max. Level ${maxLevelDisplay === 2000 ? '>' : ''}${maxLevelDisplay}`}
                            <Slider className={classes.inputControl} value={maxLevelDisplay} onChange={(e, newValue) => { setMaxLevelDisplay(newValue) }}
                                onChangeCommitted={(e, newValue) => {
                                    if (newValue === 2000) {
                                        setMaxLevel(9999)
                                    } else {
                                        setMaxLevel(newValue)
                                    }
                                }}
                                min={0} max={2000} step={100}
                                id="level-select"
                            />
                        </Typography>
                    </ListItem>

                    <Divider />
                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <FitnessCenterIcon />
                        </ListItemIcon>
                        <Typography id="world-select-label" component="div" className={classes.labelControlSkillType} gutterBottom>Skill Type
                        </Typography>
                        <FormControl component="fieldset">
                            <FormControlLabel onChange={(e, newValue) => setSkillType(newValue ? 'axe' : '')} control={<Checkbox checked={skillType === 'axe'} color="secondary" />} label="Axe" />
                            <FormControlLabel onChange={(e, newValue) => setSkillType(newValue ? 'club' : '')} control={<Checkbox checked={skillType === 'club'} color="secondary" />} label="Club" />
                            <FormControlLabel onChange={(e, newValue) => setSkillType(newValue ? 'sword' : '')} control={<Checkbox checked={skillType === 'sword'} color="secondary" />} label="Sword" />
                            <FormControlLabel onChange={(e, newValue) => setSkillType(newValue ? 'distance' : '')} control={<Checkbox checked={skillType === 'distance'} color="secondary" />} label="Distance" />
                            <FormControlLabel onChange={(e, newValue) => setSkillType(newValue ? 'magic' : '')} control={<Checkbox checked={skillType === 'magic'} color="secondary" />} label="Magic" />
                        </FormControl>

                    </ListItem>

                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <TrendingUpIcon />
                        </ListItemIcon>

                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            {`Skill Level ${skillValueDisplay}`}
                            <Slider className={classes.inputControl} value={skillValueDisplay} onChange={(e, newValue) => { setSkillValueDisplay(newValue) }} onChangeCommitted={(e, newValue) => { setSkillValue(newValue) }}
                                min={0} max={150} step={10}
                                id="level-select"
                            />
                        </Typography>

                    </ListItem>
                    <Divider />

                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <AttachMoneyIcon />
                        </ListItemIcon>

                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            {`Min. Bid ${valueDisplay}`}
                            <Slider className={classes.inputControl} value={valueDisplay} onChange={(e, newValue) => { setValueDisplay(newValue) }} onChangeCommitted={(e, newValue) => { setValue(newValue) }}
                                min={0} max={10000} step={100}
                                id="level-select"
                            />
                        </Typography>

                    </ListItem>
                    <ListItem>

                        <ListItemIcon className={classes.iconControlHidden}>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            {`Max. Bid ${maxValueDisplay === 100000 ? '>' : ''}${maxValueDisplay}`}
                            <Slider className={classes.inputControl} value={maxValueDisplay} onChange={(e, newValue) => { setMaxValueDisplay(newValue) }}
                                onChangeCommitted={(e, newValue) => {
                                    if (newValue === 100000) {
                                        setMaxValue(999999)
                                    } else {
                                        setMaxValue(newValue)
                                    }
                                }}
                                min={0} max={100000} step={100}
                                id="level-select"
                            />
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemIcon className={classes.iconControl}>
                            <GitHubIcon />
                        </ListItemIcon>
                        <Typography id="level-select-label" component="div" className={classes.labelControl} gutterBottom>
                            Made by&nbsp;
                            <Link className={classes.githubLink} target='_blank' href="https://github.com/rfaita/exiva-auctioneer">
                                rfaita
                            </Link>
                        </Typography>
                    </ListItem>
                    <Divider />


                </List>

            </Drawer>
    );

};

export default Filter;