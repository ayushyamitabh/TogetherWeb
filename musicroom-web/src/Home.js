import React, { Component } from 'react';
import {AppBar,
        Button,
        Card,
        CardContent,
        CardActions,
        Dialog,
        DialogActions,
        DialogContent,
        DialogTitle,
        Grid,
        TextField,
        Toolbar,
        Typography} from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import Video from './Video.js';
import Music from './Music.js';
import Chat from './Chat.js';
import Draw from './Draw.js';
import './Home.css';
import {Redirect} from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  createRoom(room_type) {
      this.setState({
          room_url: 'room/new', 
          room_type: room_type
      });    
  }

  render() {
    if(this.state.room_url) {
        return (<Redirect to={{
            pathname: this.state.room_url,
            state: { type: this.state.room_type }
        }} />)
    }
    return (
      <div>
        <AppBar className="navigation" position="static">
          <Toolbar>
            <Typography type="title" color="inherit">
              MUSICROOM
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid className="tiles-container" justify="center" container gutter={8}>
          <Grid item xs={3}>
            <Card className="tile">
              <CardContent>
                <Typography type="headline" component="h2">
                  MUSIC
                </Typography>
                <Typography component="p">
                  Sing-along with a friend - wherever and whenever
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                className="joinBtn"
                color="accent" 
                onClick={()=>{this.createRoom('music')}}>
                  Create A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card className="tile">
              <CardContent>
                <Typography type="headline" component="h2">
                  VIDEO
                </Typography>
                <Typography component="p">
                  Laugh at a video together - you'll seem less crazy
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                className="joinBtn"
                color="accent" 
                onClick={()=>{this.createRoom('video')}}>
                  Create A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card className="tile">
              <CardContent>
                <Typography type="headline" component="h2">
                  READ
                </Typography>
                <Typography component="p">
                  Blalalblbalbalblalb - balblalbalballba
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                className="joinBtn"
                color="accent" 
                onClick={()=>{this.createRoom('read')}}>
                  Create A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card className="tile">
              <CardContent>
                <Typography type="headline" component="h2">
                  CHAT
                </Typography>
                <Typography component="p">
                  Sometimes words are enough. Join a chat room
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                className="joinBtn"
                color="accent" 
                onClick={()=>{this.createRoom('chat')}}>
                  Create A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Card className="about">
          <CardContent>
            <Typography type="headline" component="h1">
              ABOUT US
            </Typography>
            <Typography component="p">
              <strong>MUSICROOM</strong> (name subject to change) is a start-up project by two college students.
              It is aimed at creating a unified cross-platform video, music and chat application.
              This application is being created using Socket.io, ReactJS, ReactNative, and Material-UI.
              The code is currently open-source. Checkout our links below.
            </Typography>
          </CardContent>
          <CardActions>
            <Button dense color="primary" href="https://www.github.com/ayushyamitabh/musicroom">
              Github
            </Button>
            <Button dense color="accent" href="https://github.com/ayushyamitabh">
              Ayushya Amitabh
            </Button>
            <Button dense color="accent" href="https://github.com/IshanSoni">
              Ishan Soni
            </Button>
          </CardActions>
        </Card>

        <Grid className="res-links" container justify="center">
          <Grid className="res" item xs={3}>
            <Button color="primary" raised href="https://socket.io/">
              Socket.io
            </Button>
          </Grid>
          <Grid className="res" item xs={3}>
            <Button color="primary" raised href="https://facebook.github.io/react/">
              ReactJS
            </Button>
          </Grid>
          <Grid className="res" item xs={3}>
            <Button color="primary" raised href="https://facebook.github.io/react-native/">
              React Native
            </Button>
          </Grid>
          <Grid className="res" item xs={3}>
            <Button color="primary" raised href="https://material-ui-1dab0.firebaseapp.com/">
              Material UI
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
