import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardContent, Typography, makeStyles, CardHeader, Avatar, Grid, Link } from '@material-ui/core';
import Moment from 'react-moment';
import Text from './Text';
import SkillText from './SkillText';
import Item from './Item';
import Timer from './Timer';
import AuctionText from './AuctionText';

import PublicIcon from '@material-ui/icons/Public';

const useStyles = makeStyles((theme) => ({
      root: {
            boxShadow: '2px 2px 5px 0 rgb(0,0,0,75%)',
            borderRadius: 0
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
      headerTitle: {
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(1),
            fontFamily: 'Verdana,Arial,Times New Roman,sans-serif',
            fontSize: '10pt',
            fontWeight: 'bold',
            color: theme.palette.primary.dark,
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
      body: {
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
      },
      icons: {
            width: 14,
            height: 14
      }
      
}));

const AuctionComponent = (props) => {

      const classes = useStyles();

      const findMaxSkill = function (skills) {
            let skill = "";
            let currentValue = -1;
            for (let curr in skills) {
                  if (curr.indexOf('NL') <= -1 && skills[curr] >= currentValue) {
                        skill = curr;
                        currentValue = skills[curr];
                  }
            }

            return skill;
      }

      const [maxSkill, setMaxSkill] = useState("");

      useEffect(() => {
            setMaxSkill(findMaxSkill(props.auction.skills));
      }, [props.auction.skills]);

      return (
            <Card className={classes.root}>
                  <CardHeader className={classes.header}
                        title={
                              <Grid container>
                                    <Grid item xs={12} sm={10}>
                                          <Typography className={classes.headerTitle}>{props.auction.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                          <Typography className={classes.refreshed}>
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
                                                      <Link className={classes.headerSubTitleLink} target='_blank' href={`https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${props.auction._id}&source=overview`}>
                                                            View on Tibia website
                                                      </Link>
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
                                                      <Grid item xs={12} md lg>
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
                                                                              {props.auction.auction.endDate - new Date().getTime() > 59 * 60 * 1000 || props.auction.auction.status !== 'ongoing' ?
                                                                                    <Moment format="MMM DD YYYY HH:mm:ss">
                                                                                          {props.auction.auction.endDate}
                                                                                    </Moment>
                                                                                    : <Timer time={(props.auction.auction.endDate - new Date().getTime()) / 1000} />
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
                              <Grid item xs={12} sm={3}>
                                    <div className={classes.general}>
                                          <Text label="HP" value={props.auction.status.hp} odd="true" />
                                          <Text label="MP" value={props.auction.status.mp} />
                                          <Text label="Capacity" value={props.auction.status.capacity} odd="true" />
                                          <Text label="Speed" value={props.auction.status.speed} />
                                          <Text label="Blessings" value={props.auction.skins.blessings} odd="true" />
                                          <Text label="Mounts" value={props.auction.skins.mounts} />
                                          <Text label="Outfits" value={props.auction.skins.outfits} odd="true" />
                                          <Text label="Titles" value={props.auction.skins.titles} />
                                    </div>
                              </Grid>
                              <Grid item xs={12} sm={9} >
                                    <div className={classes.general}>
                                          <SkillText label="Axe" value={props.auction.skills.axe} perc={props.auction.skills.axeNL} odd="true" max={"axe" === maxSkill} />
                                          <SkillText label="Sword" value={props.auction.skills.sword} perc={props.auction.skills.swordNL} max={"sword" === maxSkill} />
                                          <SkillText label="Club" value={props.auction.skills.club} perc={props.auction.skills.clubNL} odd="true" max={"club" === maxSkill} />
                                          <SkillText label="Fist" value={props.auction.skills.fist} perc={props.auction.skills.fistNL} max={"fist" === maxSkill} />
                                          <SkillText label="Distance" value={props.auction.skills.distance} perc={props.auction.skills.distanceNL} odd="true" max={"distance" === maxSkill} />
                                          <SkillText label="Magic" value={props.auction.skills.magic} perc={props.auction.skills.magicNL} max={"magic" === maxSkill} />
                                          <SkillText label="Shield" value={props.auction.skills.shield} perc={props.auction.skills.shieldNL} odd="true" max={"shield" === maxSkill} />
                                          <SkillText label="Fishing" value={props.auction.skills.fishing} perc={props.auction.skills.fishingNL} max={"fishing" === maxSkill} />
                                    </div>
                              </Grid>
                        </Grid>
                        <Grid container>
                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Creation Date" value={
                                                <Fragment>
                                                      <Moment format="MMM DD YYYY HH:mm:ss">
                                                            {props.auction.creationDate}
                                                      </Moment>
                                                </Fragment>
                                          } odd="true" />
                                          <Text label="Experience" value={props.auction.experience} />
                                          <Text label="Gold" value={props.auction.gold} odd="true" />
                                          <Text label="Achiv. Points" value={props.auction.achivementPoints} />
                                          <Text label="Daily Rew. Strike" value={props.auction.dailyRewardStrike} odd="true" />

                                    </div>
                              </Grid>
                        </Grid>
                        <Grid container>
                              <Grid item xs={12} sm={4}>
                                    <div className={classes.general}>
                                          <Text label="Charm Exp." value={props.auction.charm.expansion ? 'yes' : 'no'} odd="true" />
                                          <Text label="Available Points" value={props.auction.charm.available} />
                                          <Text label="Spent Points" value={props.auction.charm.spent} odd="true" />
                                    </div>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                    <div className={classes.general}>
                                          <Text label="Hunt. Task Points" value={props.auction.huntingTask.points} odd="true" />
                                          <Text label="Perm. Task Slots" value={props.auction.huntingTask.taskSlot} />
                                          <Text label="Perm. Prey Slots" value={props.auction.huntingTask.preySlot} odd="true" />
                                    </div>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                    <div className={classes.general}>
                                          <Text label="Hirelings" value={props.auction.hirelings} odd="true" />
                                          <Text label="Hirelings Jobs" value={props.auction.hirelingsJobs} />
                                          <Text label="Hirelings Outfits" value={props.auction.hirelingsOutfits} odd="true" />
                                    </div>
                              </Grid>
                        </Grid>

                        <Grid container>
                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Items" odd="true" />
                                          {!!props.auction.items && props.auction.items.map((item, index) => {
                                                return (
                                                      <Item key={index} item={item} newLine="false" />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Store Items" odd="true" />
                                          {!!props.auction.storeItems && props.auction.storeItems.map((item, index) => {
                                                return (
                                                      <Item key={index} item={item} newLine="false" />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Outfits" odd="true" />
                                          {!!props.auction.outfits && props.auction.outfits.map((item, index) => {
                                                return (
                                                      <Item key={index} size="large" item={item} newLine="false" />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Store Outfits" odd="true" />
                                          {!!props.auction.storeOutfits && props.auction.storeOutfits.map((item, index) => {
                                                return (
                                                      <Item key={index} size="large" item={item} newLine="false" />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Familiars" odd="true" />
                                          {!!props.auction.familiars && props.auction.familiars.map((item, index) => {
                                                return (
                                                      <Item key={index} size="large" item={item} newLine="false" />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Blessings" odd="true" size="large" />
                                          <Text label="Adventurer's Blessing" value={props.auction.blessings.adventurersBlessing ? "yes" : "no"} size="large" />
                                          <Text label="Blood of the Mountain" value={props.auction.blessings.bloodOfTheMountain ? "yes" : "no"} odd="true" size="large" />
                                          <Text label="Embrace of Tibia" value={props.auction.blessings.embraceOfTibia ? "yes" : "no"} size="large" />
                                          <Text label="Fire of the Suns" value={props.auction.blessings.fireOfTheSuns ? "yes" : "no"} odd="true" size="large" />
                                          <Text label="Heart of the Mountain" value={props.auction.blessings.heartOfTheMountain ? "yes" : "no"} size="large" />
                                          <Text label="Spark of the Phoenix" value={props.auction.blessings.sparkOfThePhoenix ? "yes" : "no"} odd="true" size="large" />
                                          <Text label="Spiritual Shielding" value={props.auction.blessings.spiritualShielding ? "yes" : "no"} size="large" />
                                          <Text label="Twist of Fate" value={props.auction.blessings.twistOfFate ? "yes" : "no"} odd="true" size="large" />
                                          <Text label="Wisdom of Solitude" value={props.auction.blessings.wisdomOfSolitude ? "yes" : "no"} size="large" />
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Imbuements" odd="true" />
                                          {!!props.auction.imbuements && props.auction.imbuements.map((item, index) => {
                                                return (
                                                      <Text value={item} odd={index % 2 === 0} key={index} />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Charms" odd="true" />
                                          <Text label="Costs" value="Charm Name" showSeparator="false" />
                                          {!!props.auction.charms && props.auction.charms.map((item, index) => {
                                                return (
                                                      <Text label={item.value} value={item.name} odd={index % 2 === 0} showSeparator="false" key={index} />
                                                );
                                          })}
                                    </div>
                              </Grid>


                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Titles" odd="true" />
                                          {!!props.auction.titles && props.auction.titles.map((item, index) => {
                                                return (
                                                      <Text value={item} odd={index % 2 === 0} key={index} />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Achievements" odd="true" />
                                          {!!props.auction.achivements && props.auction.achivements.map((item, index) => {
                                                return (
                                                      <Text value={item} odd={index % 2 === 0} key={index} />
                                                );
                                          })}
                                    </div>
                              </Grid>

                              <Grid item xs={12} sm={12}>
                                    <div className={classes.general}>
                                          <Text label="Bestiary Progress" odd="true" />
                                          <Text label="Kills" value="Name" showSeparator="false" />
                                          {!!props.auction.bestiary && props.auction.bestiary.map((item, index) => {
                                                return (
                                                      <Text label={item.kills} value={item.name} odd={index % 2 === 0} showSeparator="false" key={index} />
                                                );
                                          })}
                                    </div>
                              </Grid>

                        </Grid>

                  </CardContent>
            </Card >

      );

}

export default AuctionComponent;