import React from 'react'
import Cookies from 'cookies-js'
import AddSubredditOption from './AddSubredditOption'

import {addSubreddit} from './Loader'
import {updateUrl} from './UrlHandler'

var Options = React.createClass({
    propTypes: {
        subreddits: React.PropTypes.array.isRequired,
        sort: React.PropTypes.string.isRequired,
        sortT: React.PropTypes.string.isRequired,
        nsfw: React.PropTypes.bool.isRequired
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    componentDidMount: function() {
        //  if (typeof window !== 'undefined') { //client rendering
        //    this.updateUrl();
        //}
    },
    render: function() {
        if (typeof window !== 'undefined') //client rendering
            updateUrl(this.props.subreddits); //update url when subreddits potentially change

        var subreddits = this.props.subreddits.slice();

        var list = [];
        for (var sub of subreddits) {
            const final = sub;
            list.push(
                <div key={final} className={'subreddit noselect'} onClick={() => {
                    this.context.store.dispatch({type: 'REMOVE_SUBREDDITS', subreddits: [final]});
                }}>{final}</div>
            );
        }

        return (
            <div id={'options'}>
                <div>
                  <AddSubredditOption nsfw={this.props.nsfw}></AddSubredditOption>
                    <div id={'nsfw'}>
                        <label className={'noselect'}><input type={"checkbox"} checked={this.props.nsfw} onChange={e => {
                            Cookies.set('nsfw', e.target.checked);
                            this.context.store.dispatch({type: 'NSFW', nsfw: e.target.checked});
                          }}/>nsfw</label>
                    </div>
                    <div id={'sort'}>
                        <div>
                            {['hot', 'top', 'new', 'rising', 'gilded'].map(e => {
                                return (
                                    <button className={this.props.sort === e
                                        ? 'selected'
                                        : ''} key={e} onClick={() => {
                                        this.context.store.dispatch({
                                            type: 'SORT_' + e.toUpperCase()
                                        });
                                    }} type="button">{e}</button>
                                );
                            })}
                        </div>

                        {this.props.sortT !== '' && <div>
                            {['day', 'hour', 'week', 'month', 'year', 'all'].map(e => {
                                return (
                                    <button className={this.props.sortT === e
                                        ? 'selected'
                                        : ''} key={e} onClick={() => {
                                        this.context.store.dispatch({
                                            type: 'SORT_T_' + e.toUpperCase()
                                        });
                                    }} type="button">{e}</button>
                                );
                            })}
                        </div>}
                    </div>
                </div>
                <div id={'subreddits'}>
                    {list}
                </div>
            </div>
        );
    }
});
export default Options
