import React from 'react'
import ReactDOM from 'react-dom'
import Spinner from 'halogen/PulseLoader'
import {load} from './Loader'

var InfiniteScroll = React.createClass({
    propTypes: {
        loading: React.PropTypes.bool.isRequired, //currently loading
        threshold: React.PropTypes.number.isRequired //pixels to the bottom of the page to start loading
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    componentDidMount: function() {
        this.attachScrollListener();
    },
    componentDidUpdate: function() {
        this.attachScrollListener();
    },
    topPosition: function(domElt) {
        if (!domElt) {
            return 0;
        }
        return domElt.offsetTop + this.topPosition(domElt.offsetParent);
    },
    scrollListener: function() {
        var el = ReactDOM.findDOMNode(this);
        var scrollTop = (window.pageYOffset !== undefined)
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        if (this.topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this.detachScrollListener();
            //start loading
            this.context.store.dispatch(load());
        }
    },
    attachScrollListener: function() {
        if (!this.props.loading) {
            window.addEventListener('scroll', this.scrollListener);
            window.addEventListener('resize', this.scrollListener);
            this.scrollListener();
        }
    },
    detachScrollListener: function() {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    },
    componentWillUnmount: function() {
        this.detachScrollListener();
    },
    render: function() {
        return (
            <div className="center spinner">
                {this.props.loading && <Spinner color="#969696" size="20px" margin="5px"/>}
            </div>
        ); // 00BB3F
    }
});

export default InfiniteScroll;
