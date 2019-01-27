import React, {Component, PropTypes} from 'react';

export default class RedditButton extends Component {
    render() {
        return (
            <button title="Reddit" className="lightbox-button" onClick={this.props.handler}>
                <img width={30} height={30} src={'http://localhost:3001/images/reddit.svg'}></img>
            </button>
        )
    }
}
