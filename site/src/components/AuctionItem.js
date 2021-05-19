import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardContent, Typography, makeStyles, CardHeader, Avatar, Grid, Link as NormalLink, Chip, IconButton } from '@material-ui/core';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import SkillText from './SkillText';
import Item from './Item';
import Timer from './Timer';
import AuctionText from './AuctionText';

import AddAlertIcon from '@material-ui/icons/AddAlert';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PublicIcon from '@material-ui/icons/Public';
import useNotification from '../hooks/useNotification';
import { modalView, event } from '../services/tracking';

const useStyles = makeStyles((theme) => ({
      root: {
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            borderRadius: 0,
            '&:last-child': {
                  paddingBottom: 0
            }
      },
      header: {
            padding: 0,
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            background: theme.palette.primary.main,
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
      },
      headerLink: {
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            fontSize: '10pt',
            color: theme.palette.primary.dark,
            fontWeight: 'bold',
            textDecoration: 'underline'
      },
      headerTitle: {
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(1),
      },
      headerSubTitle: {
            marginRight: theme.spacing(1),
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            fontSize: '9pt',
            color: theme.palette.primary.dark,
            border: 1,
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            borderStyle: 'dashed',
            borderColor: theme.palette.primary.dark,
            paddingBottom: 3
      },
      headerSubTitleLink: {
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            fontSize: '9pt',
            color: theme.palette.primary.dark,
            marginLeft: theme.spacing(1),
            textDecoration: 'underline'
      },
      refreshed: {
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            fontSize: '6pt',
            color: theme.palette.primary.dark,
            padding: 2,
            textAlign: 'right',
      },
      headerSubTitleDiv: {

      },
      outfit: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            background: theme.palette.primary.light,
            width: 68,
            height: 68,
            paddingBottom: 15,
            paddingRight: 15,
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,

      },
      showRoomItems: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            width: 78,
            height: 80,
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
            background: theme.palette.primary.light,
            paddingLeft: 3,
            paddingBottom: 3
      },
      status: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            color: theme.palette.primary.dark,
            background: theme.palette.primary.light,
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
            padding: 3,
            height: 77
      },
      general: {
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
            background: theme.palette.primary.light,
            padding: 3,
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1)
      },
      charm: {
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            border: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
            background: theme.palette.primary.light,
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            height: 24,
      },
      charms: {
            marginRight: theme.spacing(1)
      },
      body: {
            minHeight: 164,
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            color: theme.palette.primary.dark,
            background: theme.palette.primary.main,
            padding: 0,
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            border: 1,
            borderTop: 0,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.dark,
            '&:last-child': {
                  paddingBottom: 0
            }
      },
      icons: {
            width: 14,
            height: 14
      },
      notification: {
            marginTop: 4,
            marginRight: 4,
            height: 24,
            width: 24
      }
}));

const AuctionItem = (props) => {

      const classes = useStyles();

      const openDetailDialog = (e) => {
            e.preventDefault();
            props.openDetailDialog(props.auction._id);
            modalView(`/auction/${props.auction._id}`);
      }

      const findMaxSkill = function (skills) {
            let skill = '';
            let currentValue = -1;
            for (let curr in skills) {
                  if (curr.indexOf('NL') <= -1 && skills[curr] >= currentValue) {
                        skill = curr;
                        currentValue = skills[curr];
                  }
            }

            return skill;
      }

      const [maxSkill, setMaxSkill] = useState('');

      useEffect(() => {
            setMaxSkill(findMaxSkill(props.auction.skills));
      }, [props.auction.skills]);

      const [auctionId, setAuctionId] = useState(null);
      const [insert, setInsert] = useState(false);
      const { notification } = useNotification(auctionId, props.token, insert);


      useEffect(() => {
            setInsert(localStorage.getItem(props.auction._id) === 'true');
      }, [props.auction._id])

      useEffect(() => {
            localStorage.setItem(auctionId, insert);
      }, [notification, auctionId, insert]);


      const handleNotification = () => {
            setInsert(!insert);
            setAuctionId(props.auction._id);

            event({
                  category: 'Notification',
                  action: insert ? `Removing ${props.auction._id}` : `Adding ${props.auction._id}`
            });
      }


      return (
            <Card className={classes.root}>
                  <CardHeader className={classes.header}
                        title={
                              <Grid container>
                                    <IconButton variant="contained" className={classes.notification} onClick={handleNotification}>
                                          {insert ? <NotificationsActiveIcon /> : <AddAlertIcon />}
                                    </IconButton>
                                    <Grid item xs sm md lg>
                                          <Typography className={classes.headerTitle}>
                                                <Link className={classes.headerLink} onClick={openDetailDialog} to={`/auction/${props.auction._id}`}>
                                                      {props.auction.name}
                                                </Link>
                                          </Typography>
                                    </Grid>
                                    <Grid item xs sm md lg>
                                          <Typography className={classes.refreshed} >
                                                Last update:
                                                <Moment format=" MMM DD YYYY HH:mm:ss">
                                                      {props.auction.lastUpdate}
                                                </Moment>
                                          </Typography>
                                    </Grid>
                              </Grid>
                        }
                        subheader={
                              <div className={classes.headerSubTitleDiv}>

                                    <Grid container>
                                          <Grid item xs={12}>
                                                <Typography className={classes.headerSubTitle}>
                                                      Level {props.auction.level} - {props.auction.vocation} | <PublicIcon className={classes.icons} /> World: {props.auction.server} |
                                                      <NormalLink className={classes.headerSubTitleLink} target='_blank' href={`https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${props.auction._id}&source=overview`}>
                                                            View on Tibia website
                                                      </NormalLink>
                                                </Typography>
                                          </Grid>
                                          <Grid item xs={12}>
                                                <Grid container justify="flex-start">
                                                      <Grid item >
                                                            <Avatar variant="square" aria-label="recipe" className={classes.outfit} src={`https://static.tibia.com/images/charactertrade${props.auction.outfit}`} alt={props.auction.name} />
                                                      </Grid>
                                                      <Grid item >
                                                            <div className={classes.showRoomItems}>
                                                                  {!!props.auction.showRoomItems && props.auction.showRoomItems.map((item, index) => {
                                                                        return (
                                                                              <Item key={index} item={item} newLine={index !== 2} />
                                                                        );
                                                                  })}
                                                            </div>
                                                      </Grid>
                                                      <Grid item xs={12} md={12} lg>
                                                            <div className={classes.status}>
                                                                  <AuctionText label="Started At" value={
                                                                        <Fragment>
                                                                              <Moment format="MMM DD YYYY HH:mm:ss">
                                                                                    {props.auction.auction.startDate}
                                                                              </Moment>
                                                                        </Fragment>
                                                                  } odd="true" />
                                                                  <AuctionText label="End At" value={
                                                                        <Fragment>
                                                                              {props.auction.auction.endDate - new Date().getTime() > 30 * 60 * 1000 || props.auction.auction.status !== 'ongoing' ?
                                                                                    <Moment format="MMM DD YYYY HH:mm:ss">
                                                                                          {props.auction.auction.endDate}
                                                                                    </Moment>
                                                                                    : <Timer time={(props.auction.auction.endDate - new Date().getTime()) / 1000} ring={props.refreshAuctions} />
                                                                              }
                                                                        </Fragment>
                                                                  } />
                                                                  <AuctionText label={!!props.auction.auction.hasBid ? props.auction.auction.status === "finished" ? "Winning Bid" : "Current Bid" : "Minimum Bid"} value={props.auction.auction.value} odd="true" />
                                                                  <AuctionText label="Status" value={props.auction.auction.status} />
                                                            </div>
                                                      </Grid>
                                                </Grid>
                                          </Grid>
                                    </Grid>

                              </div>

                        }
                  />
                  <CardContent className={classes.body}>
                        <Grid container>
                              <Grid item xs={6} sm={6} >
                                    <div className={classes.general}>
                                          <SkillText label="Axe" value={props.auction.skills.axe} perc={props.auction.skills.axeNL} odd="true" max={'axe' === maxSkill} />
                                          <SkillText label="Sword" value={props.auction.skills.sword} perc={props.auction.skills.swordNL} max={'sword' === maxSkill} />
                                          <SkillText label="Club" value={props.auction.skills.club} perc={props.auction.skills.clubNL} odd="true" max={'club' === maxSkill} />
                                          <SkillText label="Fist" value={props.auction.skills.fist} perc={props.auction.skills.fistNL} max={'fist' === maxSkill} />
                                    </div>
                              </Grid>
                              <Grid item xs={6} sm={6} >
                                    <div className={classes.general}>
                                          <SkillText label="Distance" value={props.auction.skills.distance} perc={props.auction.skills.distanceNL} odd="true" max={'distance' === maxSkill} />
                                          <SkillText label="Magic" value={props.auction.skills.magic} perc={props.auction.skills.magicNL} max={'magic' === maxSkill} />
                                          <SkillText label="Shield" value={props.auction.skills.shield} perc={props.auction.skills.shieldNL} odd="true" max={'shield' === maxSkill} />
                                          <SkillText label="Fishing" value={props.auction.skills.fishing} perc={props.auction.skills.fishingNL} max={'fishing' === maxSkill} />
                                    </div>
                              </Grid>
                              <Grid item xs={12} sm={12} >
                                    <div className={classes.charms}>
                                          {!!props.auction.charms && props.auction.charms.map((item, index) => {
                                                return (
                                                      <Chip key={index} label={item.name} className={classes.charm} />

                                                );
                                          })}
                                    </div>
                              </Grid>
                        </Grid>
                  </CardContent>
            </Card >

      );

}

export default AuctionItem;