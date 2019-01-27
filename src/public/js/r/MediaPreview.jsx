import React from 'react'

var MediaPreview = React.createClass({
    propTypes: {
        // there are a lot
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    renderImage: function() {
        return (
            <img className={this.props.className}
                 style={this.props.style}
                 width={this.props.width}
                 height={this.props.height}
                 srcSet={this.props.data.srcset}
                 src={this.props.data.src}></img>
        );
    },
    renderGif: function() {
        // render thumbnail and play icon
        // get icon from IcoMoon.io
        return (
            <div className={this.props.className} style={this.props.style}>
                <img width={this.props.width}
                     height={this.props.height}
                     srcSet={this.props.data.srcset}
                     src={this.props.data.src}></img>
                <div style={{
                    position: 'relative'
                }}>
                    <img src={"http://localhost:3001/images/play.svg"}
                         width={40}
                         height={40}
                         style={{
                           left: (this.props.width / 2 - 20) + 'px',
                           top: (this.props.height / 2 - 20) + 'px',
                         }}></img>
                </div>
            </div>

        );
    },
    render: function() {
        switch (this.props.type) {
            case 'image/gif':
            case 'gfycat':
                return this.renderGif();
            case 'image':
                return this.renderImage();
        }
    }
});

export default MediaPreview
