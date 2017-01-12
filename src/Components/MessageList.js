require('../Layouts/App.css');
require('../Layouts/index.css');

import React from 'react';
import MessageList from './MessageList';

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

MessageList.defaultProps = { };

export default MessageList;
