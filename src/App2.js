import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Sidebar from 'react-sidebar';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg';
import Infinite from 'react-infinite';
import './App.css';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
injectTapEventPlugin();

function Rooms(props){
	return (
		<div>
		<Subheader>rooms</Subheader>
		<List>
			{props.elements.map(e => (
				<div>
				<ListItem 
					primaryText={e.name}
					secondaryText={e.messages[e.messages.length -1] ? e.messages[e.messages.length -1].body : ""}
				/>
				<Divider/>
				</div>
			))}
		</List>
		</div>
	);
}

function DirectChats(props){
	return (
		<div>
		<Subheader>direct</Subheader>
		<List>
			{props.elements.map(e => (
				<div>
				<ListItem 
					primaryText={e.name}
					secondaryText={e.messages[e.messages.length -1] ? e.messages[e.messages.length -1].body : ""}
				/>
				<Divider/>
				</div>
			))}
		</List>
		</div>
	);
}

function ActionButtons(props){
	return (
	<FloatingActionButton mini={true}>
      <ContentAdd />
    </FloatingActionButton>
	);
}

function TopBar(props){
	const iconStyles = {
		marginRight: 24,
	};
	return (
		<AppBar
			title={props.title}
			iconElementLeft={(<span/>)}
			iconElementRight={(<IconButton><MoreVert/></IconButton>)}
		/>
	);
}

function MessageList(props){

	function selfStyle(msg) {
		return props.currentUser === msg.sender ?
		{ 'text-align': 'right' } : {}
	}

	return (
		<div>
			{props.messages.map(msg => (
				<div style={selfStyle(msg)}>
					<dt>{msg.sender + " - " + msg.sentAt}</dt>
					<dd>{msg.body}</dd>
					<Divider/>
				</div>
			))
			}
		</div>
	);
}

class SubmissionArea extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			messageText: ''
		}
	}

	handleTextFieldChange = (e, val) => {
		this.setState({messageText: val})
	}

	render() {
		var txtStyle = {
		width: '85%' // todo
		}

		const margins={
			"margin-top": '10px',
			//width: '100%'
		}

		return (
			<div style={margins}>
				<TextField
					hintText="Message"
					multiLine={true}
					rowsMax={4}
					style={txtStyle}
					onChange={this.handleTextFieldChange}
					value={this.state.messageText}
				/>
				<RaisedButton 
					label="Send" 
					onClick={this.handleSubmit} 
				/>	
			</div>
		);
	}
}

function MainPane(props){
	const style = {
		margin:'20px'
	}
	return (
		<div >
			<TopBar
				title={props.chat.members}
			/>
			<div style={style}>
				<MessageList
					currentUser={props.currentUser}
					messages={props.chat.messages}
				/>
				<SubmissionArea/>
			</div>
		</div>
	);
}

function SideDrawer(props){
	return (
		<Drawer
			//open={true}
			width={props.width}
			docked={true}
		>
			<ActionButtons/>
			<Rooms
				elements={props.rooms}
			/>
			<DirectChats
				elements={props.directChats}
			/>
		</Drawer>
	);
}

const App = class MessageApp extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		var directChat = {
					id: ["alice@evilcorp.com", "bob@chat.allsafe.net", "nfischer@nrktkt.tk"],
					name: "alice, bob",
					members: "alice@evilcorp.com, bob@chat.allsafe.net",
					messages: [
						{
							sender: "alice@evilcorp.com",
							body: "what should we do?",
							sentAt: Date.parse("2017-01-22T16:21:13Z")
						},
						{
							sender: "bob@chat.allsafe.net",
							body: "Idk, hide?",
							sentAt: Date.parse("2017-01-22T17:21:13Z")
						},
						{
							sender: "me",
							body: "I knew we shouldn't have taken that acid",
							sentAt: Date.parse("2017-01-22T18:21:13Z")
						}
					]
				};

		var room = {
					id: "blackdev#csubj.io",
					name: "blackdev#csubj.io",
					messages: [
						{
							sender: "me",
							body: "React is pretty nice"
						}
					]
				};

		const contentStyle = {  transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };

  
      contentStyle.marginLeft = 256;
    
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
			<div>
				<SideDrawer
					directChats={[directChat]}
					rooms={[room]}
					width={256}
				/>
				<div style={contentStyle}>
				<MainPane 
					chat={directChat}
					currentUser="me"
				/>
				</div>
			</div>			
			</MuiThemeProvider>
		);
	}
}

export default App;


