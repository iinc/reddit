import React from 'react'
import NotificationSystem from 'react-notification-system'

import Gallery from './Gallery'
import InfiniteScroll from './InfiniteScroll'
import Options from './Options'

var Container = React.createClass({
    _notificationSystem: null,
    propTypes: {
        elements: React.PropTypes.array.isRequired,
        loading: React.PropTypes.bool.isRequired,
        subreddits: React.PropTypes.array.isRequired,
        more: React.PropTypes.bool.isRequired,
        sort: React.PropTypes.string.isRequired,
        sortT: React.PropTypes.string.isRequired,
        nsfw: React.PropTypes.bool.isRequired,
        notification: React.PropTypes.object.isRequired
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    componentWillReceiveProps: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },
    render: function() {
        if (Object.keys(this.props.notification).length > 0) { // notification exists
            this.context.store.dispatch({type: 'REMOVE_NOTIFICATION', payload: this.props.notification});
            this._notificationSystem.addNotification(this.props.notification);
        }

        return (
            <div>
                <Options subreddits={this.props.subreddits} sort={this.props.sort} sortT={this.props.sortT} nsfw={this.props.nsfw}/>
                <Gallery photos={this.props.elements} disableLightbox={false}/>
                <NotificationSystem ref="notificationSystem"/> {this.props.more && this.props.subreddits.length > 0 && <InfiniteScroll loading={this.props.loading} threshold={1000}/>}
            </div>
        );
    }
});

export default Container
