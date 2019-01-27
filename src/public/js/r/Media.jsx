import React from 'react'

var Media = React.createClass({
    propTypes: {
        // there are a lot
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    componentDidMount: function() {
      const video = this.refs.video;
      if (typeof video !== 'undefined'){
          video.play();
      }
    },
    renderImage: function() {
        return (
            <img className={this.props.className}
                 style={this.props.style}
                 src={this.props.data.src}></img>
        );
    },
    renderGif: function() {
        // check to see if video sources exist before creating video element
        if (typeof this.props.data.sources !== 'undefined') {
            var sources = [];
            this.props.data.sources.forEach((source) => {
                sources.push(
                    <source key={source.src} src={source.src} type={source.type}></source>
                );
            });
            sources.push(this.renderImage()); // fallback for old computers

            return (
                <video ref="video"
                       className={this.props.className}
                       style={this.props.style}
                       controls={false}
                       loop={true}
                       autoPlay={true}>
                    {sources}

                </video>
            )
        } else {
            return this.renderImage();
        }
    },
    renderGfycat: function(){
      const gfyName = this.props.data.gfyName;
      return (
        <iframe className={this.props.className}
                style={{...this.props.style,
                  height: this.props.height,
                  width: this.props.width}}
                src={`https://gfycat.com/ifr/${this.props.data.gfyName}`}
                frameBorder={0}
                scrolling={'no'}></iframe>

      );
    },
    render: function() {
        switch (this.props.type) {
            case 'gfycat':
              return this.renderGfycat();
            case 'image/gif':
                return this.renderGif();
            case 'image':
                return this.renderImage();
        }
    }
});

export default Media
