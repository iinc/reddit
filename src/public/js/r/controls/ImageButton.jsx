import React, {Component, PropTypes} from 'react';

export default class ImageButton extends Component {
    render() {
        return (
            <button title="Image" className="lightbox-button" onClick={this.props.handler}>
                <img width={30} height={30} src={'http://localhost:3001/images/image.svg'}></img>
            </button>
        )
    }
}
