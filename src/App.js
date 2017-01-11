import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sidebar from 'react-sidebar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List } from 'react-virtualized';
import logo from './logo.svg';
import './App.css';
injectTapEventPlugin();


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
      <List
          height={200}
          rowHeight={50}
          rowCount={messages.length}
          rowRenderer={MessageItem}
      >
        {this.props.messages.map(message => (
            <MessageItem sender={message.sender} sentAt={message.sentAt} message={message.message} key={message.sentAt}/>
            ))}
      </List>
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
      messages: [], 
      text: '', 
      sidebarOpen: false,
      sidebarDocked: false
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

  render() {
    var sidebarContent = <b className="sidebar">Sidebar content</b>;

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
            <MessageList messages={this.state.messages} />
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
