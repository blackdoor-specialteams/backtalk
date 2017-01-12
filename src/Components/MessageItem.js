require('../Layouts/App.css');
require('../Layouts/index.css');

import React from 'react';

class MessageItem extends React.Component {
    render() {
        return (
            <div>
                <dt>{props.sender} @ {props.sentAt}</dt>
                <dd>{props.message}</dd>
            </div>
        );
    }
}

MessageItem.defaultProps = { };

export default MessageItem;