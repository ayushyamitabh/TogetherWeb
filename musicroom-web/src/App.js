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
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      roomOpen: false,
      roomType: '',
      roomCO: ''
    }
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.openRoom = this.openRoom.bind(this);
    this.getRoomName = this.getRoomName.bind(this);
    this.requestCancel = this.requestCancel.bind(this);
  }
  getRoomName (type, co) {
    this.setState({
      getName: true,
      stallType: type,
      stallCO: co
    })
  }
  requestCancel () {
    this.setState({
      getName: false,
      stallType: '',
      stallCO: ''
    })
  }
  openRoom(type,co) {
    this.setState({
      userRoomName: document.getElementById('userRoomName').value,
      userName: document.getElementById('userName').value,
      roomOpen: true,
      roomType: type,
      roomCO: co,
      getName: false
    })
  }
  handleRequestClose() {
    this.setState({
      roomOpen: false,
      roomType: '',
      roomCO: ''
    })
  }
  render() {
    return (
      <div>
        <Dialog 
          ignoreBackdropClick={true}
          open={this.state.getName}
          onRequestClose={()=>{this.setState({getName:false})}}
        >
          <DialogTitle>
            {"Enter A Room Name"}
          </DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth 
              label="Room Name"
              className="roomNameInput"
              id="userRoomName"
            />
            <TextField 
              fullWidth 
              label="Your Name"
              id="userName"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{this.openRoom(this.state.stallType, this.state.stallCO)}} color="primary">
              {
                this.state.stallCO === 'open' ? 'Join Room' :
                this.state.stallCO === 'create' ? 'Create Room' :
                'Join / Create'
              }
            </Button>
            <Button onClick={this.requestCancel} color="accent">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen
          open={this.state.roomOpen}
          onRequestClose={this.handleRequestClose}
          transition={<Slide direction="up" />}>
          <AppBar>
            <Toolbar>
              <Typography type="title" className="room-title">
                {this.state.roomType.toString().toUpperCase()}
              </Typography>
              <Button onClick={this.handleRequestClose} color="contrast">EXIT</Button>
            </Toolbar>
          </AppBar>
          {
            this.state.roomType === 'video' ? <Video co={this.state.roomCO} /> :
            this.state.roomType === 'music' ? <Music co={this.state.roomCO} /> :
            this.state.roomType === 'chat' ? <Chat name={this.state.userName} room={this.state.userRoomName} co={this.state.roomCO} /> :
            <div>{this.state.roomCO}</div>
          }
        </Dialog>

        <AppBar className="navigation" position="static">
          <Toolbar>
            <Typography type="title" color="inherit">
              MUSICROOM
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid className="tiles-container" justify="center" container gutter={8}>
          <Grid item xs={4}>
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
                onClick={()=>{this.getRoomName('chat','open')}}>
                  Join A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={4}>
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
                onClick={()=>{this.getRoomName('chat','open')}}>
                  Join A Room
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={4}>
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
                onClick={()=>{this.getRoomName('chat','open')}}>
                  Join A Room
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

export default App;
