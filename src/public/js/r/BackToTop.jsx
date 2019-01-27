import React from 'react'
import ReactDOM from 'react-dom'

var BackToTop = React.createClass({
    propTypes: {
        show: React.PropTypes.bool.isRequired
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    // getInitialState() {
    //     return {previousScroll: 0, scrolledUp: false};
    // },
    // componentDidMount: function() {
    //     this.attachScrollListener();
    // },
    // componentDidUpdate: function() {
    //     this.attachScrollListener();
    // },
    // scrollListener: function() {
    //     var scrollTop = (window.pageYOffset !== undefined)
    //         ? window.pageYOffset
    //         : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    //
    //     this.setState({
    //         scrolledUp: scrollTop < this.state.previousScroll,
    //         previousScroll: scrollTop
    //     });
    // },
    // attachScrollListener: function() {
    //     window.addEventListener('scroll', this.scrollListener);
    //     window.addEventListener('resize', this.scrollListener);
    //     //this.scrollListener();
    // },
    // detachScrollListener: function() {
    //     window.removeEventListener('scroll', this.scrollListener);
    //     window.removeEventListener('resize', this.scrollListener);
    // },
    // componentWillUnmount: function() {
    //     this.detachScrollListener();
    // },
    handleClick: function() {
        window.scrollTo(0, 0);
    },
    render: function() {
      //&& this.state.scrolledUp
        return (
            <div>
                {this.props.show  && <button title="Top" style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: '10px 10px'
                }} onClick={this.handleClick}>
                    <img width={30} height={30} src={'http://localhost:3001/images/arrow-up.svg'}></img>
                </button>}
            </div>
        );
    }
});

export default BackToTop;
