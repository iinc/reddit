import Notifications from 'react-notification-system-redux'
// verifies that a subreddit is valid and then adds it
export function addSubreddit(subreddit) {
    return (dispatch, getState) => {
        const lowsubreddit = subreddit.toLowerCase();
        for (var sub of getState().subreddits) {
            if (sub.toLowerCase() === lowsubreddit)
                return;
        }

        const request = require('superagent'); // import doesn't work for some reason
        request.get('https://www.reddit.com/r/' + lowsubreddit + '/.json')
            .query({
                limit: 0
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                for (var sub of getState().subreddits) {
                    if (sub.toLowerCase() === lowsubreddit)
                        return;
                }

                if (err) {
                    dispatch({
                        type: 'DISPLAY_NOTIFICATION',
                        payload: {
                            title: 'Error',
                            message: `Unable to add the subreddit "${subreddit}"`,
                            level: 'error',
                            position: 'bl'
                        }
                    });
                    return;
                }

                if (!res.body.error) {
                    if (typeof res.body.data !== 'undefined' && res.body.data.children.length > 0) {
                        const post = res.body.data.children[0].data;
                        if (typeof post.subreddit === 'string') {
                            subreddit = post.subreddit;
                        }
                    }

                    dispatch({
                        type: 'ADD_SUBREDDITS',
                        subreddits: [subreddit]
                    });
                }
            });
    }
}

// loads elements
export function load() {
    return (dispatch, getState) => {
        if (getState().loading)
            return;

        const prevAfter = getState().after,
            sort = getState().sort,
            sortT = getState().sortT,
            nsfw = getState().nsfw,
            subreddits = getState().subreddits;

        //update state
        dispatch({
            type: 'LOADING'
        });

        const request = require('superagent'); // import doesn't work for some reason
        request.get('https://www.reddit.com/r/' + subreddits.join('+') + '/' + sort + '/.json')
            .query({
                //sort: sort,
                limit: 12,
                after: prevAfter,
                t: sortT
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!getState().loading || prevAfter !== getState().after || sort !== getState().sort || sortT !== getState().sortT || nsfw !== getState().nsfw || !subreddits.equals(getState().subreddits))
                    return;

                if (err) {
                    dispatch({
                        type: 'DISPLAY_NOTIFICATION',
                        payload: {
                            title: 'Error',
                            message: 'Loading data from reddit failed. Please make sure nothing is blocking cross-origin requests.',
                            level: 'error',
                            position: 'bl'
                        }
                    });
                    setTimeout(() => dispatch({
                        type: 'LOADING_FAILURE',
                        more: true
                    }), 5000);
                    return;
                }

                const after = res.body.data.after;
                var posts = [];
                for (var post of res.body.data.children) {
                    //console.log(post);
                    if (!post.data.stickied && !post.data.is_self && (nsfw || !post.data.over_18)) {
                        //console.log(post.data);
                        posts.push({
                            url: post.data.url || post.data.link_url,
                            title: post.data.title,
                            permalink: post.data.permalink,
                            preview: post.data.preview
                        });
                    }
                }

                //console.log(urls)
                request.post('/api/content')
                    .set('Content-Type', 'application/json')
                    .send({
                        posts: posts
                    })
                    .set('Accept', 'application/json')
                    .end(function(err, res) {
                        if (!getState().loading || prevAfter !== getState().after || sort !== getState().sort || sortT !== getState().sortT || nsfw !== getState().nsfw || !subreddits.equals(getState().subreddits))
                            return;

                        if (err) {
                            dispatch({
                                type: 'DISPLAY_NOTIFICATION',
                                payload: {
                                    title: 'Error',
                                    message: 'Loading data from server failed',
                                    level: 'error',
                                    position: 'bl'
                                }
                            });
                            dispatch({
                                type: 'LOADING_FAILURE',
                                more: false
                            });
                            return;
                        }

                        var elements = res.body.filter((a) => {
                            for (var b of getState().elements){
                                if (a.direct === b.direct){
                                    //console.log('removed' + a.direct)
                                    return false;
                                }
                            }
                            return true;
                        });

                        dispatch({
                            type: 'LOADING_COMPLETE',
                            elements,
                            after: after,
                            more: res.body.length > 0
                        });
                    });
            });
    }
}
