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

class RoomNotFound extends Component {
    constructor(props) {
        super(props);
        this.state={}
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
                  Room not found. Please create one below!
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
                    onClick={()=>{this.createRoom('music')}}>
                      Create A Room
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
                    onClick={()=>{this.createRoom('video')}}>
                      Create A Room
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
                    onClick={()=>{this.createRoom('chat')}}>
                      Create A Room
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      }
}

export default RoomNotFound;