import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sidebar from 'react-sidebar';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg';
import Infinite from 'react-infinite';
import './App.css';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
injectTapEventPlugin();

class Room {
    constructor(messages, name){
        this.messages = messages;
        this.name = name
    }

    displayName(){
        name
    }
}

class DirectChat {
    constructor(messages, participants){
        this.messages = messages;
        this.participants = participants;
    }

    displayName(){
        this.participants;
    }
}

class Message {
    constructor(sender, time, body){
        this.sender = sender;
        this.time = time;
        this.body = body;
    }
}

function MessageItem(props){
  return(
    <div>
      <dt>{props.sender} @ {props.sentAt}</dt>
      <dd>{props.message}</dd>
    </div>
  );
}

class MessageList extends React.Component {
  render() {
    return (
      <Infinite
          containerHeight={200}
          elementHeight={20}
          displayBottomUpwards
      >
        {this.props.messages.map(message => (
            <MessageItem sender={message.sender} sentAt={message.sentAt} message={message.message} key={message.sentAt}/>
            ))}
      </Infinite>
    );
  }
}

function SidebarContent(props) {

    return(
   
      <List>
        <Subheader>rooms</Subheader>
        {props.rooms.map(chat => 
          <div>
          <ListItem 
            primaryText={chat.displayName()} 
            secondaryText={
              chat.messages[0] ?
                chat.messages[0].body
              : ""
            }
          />
          <Divider />
          </div>
        )}
        <Subheader>direct chats</Subheader>
        {props.directChats.map(chat => 
          <div>
          <ListItem 
            primaryText={chat.participants} 
            secondaryText={
              chat.messages[0] ?
                chat.messages[0].body
              : ""
            }
          />
          <Divider />
          </div>
        )}
      </List>
    );
}

class NewDirectChatDialog extends React.Component {
  constructor(props){
    super(props);
    this.onNewDc = props.onNewDc;
    this.state = { 
      open : props.visible,
      text : '' 
    }
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleUpdate = (e, val) => {
    this.setState({text: val});
  }

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
          this.onNewDc(this.state.text);
          this.handleClose();
        }}
      />,
    ];

    return (
      <Dialog 
        title="New Direct Chat"
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        Join Chat (just one other person for now)
        <TextField
              floatingLabelText="to"
              value={this.state.text}
              onChange={this.handleUpdate}
        />
      </ Dialog>
    );
  }
}

const App = class MessageApp extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    //this.toggleSidebar = this.toggleSidebar.bind(this);
    //this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.state = {
      currentChat : new Room([], "newRoom"), 
      text: '', 
      sidebarOpen: false,
      sidebarDocked: false,
      rooms: [],
      directChats: [],
      newChatDialogVisible: false,
    };
    self = this;
  }

  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  toggleSidebar = (e) => {
    if(!this.state.sidebarDocked)
      self.onSetSidebarOpen(!self.state.sidebarOpen);
  }

  componentWillMount() {
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged = () => {
    this.setState({sidebarDocked: this.state.mql.matches});
  }

  handleMaterialChange = (e, newVal) => {
    this.setState({text: newVal});
  }

  newChat = (e) => {
    var chats = this.state.directChats;
    chats.unshift(new DirectChat([], [e]));
    this.setState({directChats: chats});
  }

  showNewChatDialog = () => {
    this.setState({newChatDialogVisible: true})
  }

  render() {
    var sidebarContent = <SidebarContent className="sidebar" rooms={this.state.rooms} directChats={this.state.directChats}/>;
    var txtStyle = {
      width: '75%' // todo
    }

    return (
      <div className="main">
        <MuiThemeProvider>
          <Sidebar sidebar={sidebarContent}
                  open={this.state.sidebarOpen}
                  docked={this.state.sidebarDocked}
                  onSetOpen={this.onSetSidebarOpen}>
            
            <TextField
              hintText="Message"
              multiLine={true}
              rowsMax={4}
              style={txtStyle}
              onChange={this.handleMaterialChange}
              value={this.state.text}
            />
            <RaisedButton 
              label="Send" 
              onClick={this.handleSubmit} 
            />
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.handleChange} value={this.state.text} />
              <button>Send</button>
            </form>
            <button onClick={this.toggleSidebar}>sidebar</button>

            <FloatingActionButton onClick={this.showNewChatDialog}>
              <ContentAdd />
            </FloatingActionButton>
            
            <NewDirectChatDialog 
              visible={this.state.newChatDialogVisible}
              onNewDc={this.newChat}
            />

          </Sidebar>
        </MuiThemeProvider>
      </div>
    );
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var now = new Date();
    var newItem = {
      message: this.state.text,
      sender: "me",
      sentAt: now.toISOString()
    };

    this.setState((prevState) => ({
      messages: prevState.messages.concat(newItem),
      text: ''
    }));
  }
}

export default App;
