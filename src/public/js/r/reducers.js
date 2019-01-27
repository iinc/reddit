export function subreddits(state = [], action) {
    switch (action.type) {
        case 'ADD_SUBREDDITS':
            var subreddits = [
                ...state,
                ...action.subreddits
            ]
            return subreddits;
        case 'REMOVE_SUBREDDITS':
            var clone = state.slice(0);
            var modified = false;
            for (var subreddit of action.subreddits) {
                const index = clone.indexOf(subreddit);
                if (index >= 0) {
                    clone.splice(index, 1);
                    modified = true;
                }
            }
            if (modified) {
                return clone;
            }
            // fall through
        default:
            return state;
    }
}

export function elements(state = [], action) {
    switch (action.type) {
        case 'SORT_HOT':
        case 'SORT_NEW':
        case 'SORT_RISING':
        case 'SORT_GILDED':
        case 'SORT_TOP':
        case 'SORT_T_DAY':
        case 'SORT_T_HOUR':
        case 'SORT_T_WEEK':
        case 'SORT_T_MONTH':
        case 'SORT_T_YEAR':
        case 'SORT_T_ALL':
        case 'ADD_SUBREDDITS':
        case 'REMOVE_SUBREDDITS':
        case 'NSFW':
            return [];
        case 'LOADING_COMPLETE':
            return [
                ...state,
                ...action.elements
            ];
        default:
            return state;
    }
}
export function after(state = '', action) {
    switch (action.type) {
        case 'SORT_HOT':
        case 'SORT_NEW':
        case 'SORT_RISING':
        case 'SORT_GILDED':
        case 'SORT_TOP':
        case 'SORT_T_DAY':
        case 'SORT_T_HOUR':
        case 'SORT_T_WEEK':
        case 'SORT_T_MONTH':
        case 'SORT_T_YEAR':
        case 'SORT_T_ALL':
        case 'ADD_SUBREDDITS':
        case 'REMOVE_SUBREDDITS':
        case 'NSFW':
            return '';
        case 'LOADING_COMPLETE':
            return action.after;
        default:
            return state;
    }
}

export function loading(state = false, action) {
    switch (action.type) {
        case 'LOADING':
            return true;
        case 'SORT_HOT':
        case 'SORT_NEW':
        case 'SORT_RISING':
        case 'SORT_GILDED':
        case 'SORT_TOP':
        case 'SORT_T_DAY':
        case 'SORT_T_HOUR':
        case 'SORT_T_WEEK':
        case 'SORT_T_MONTH':
        case 'SORT_T_YEAR':
        case 'SORT_T_ALL':
        case 'ADD_SUBREDDITS':
        case 'REMOVE_SUBREDDITS':
        case 'NSFW':
        case 'LOADING_COMPLETE':
        case 'LOADING_FAILURE':
            return false;
        default:
            return state;
    }
}

export function more(state = true, action) {
    switch (action.type) {
        case 'SORT_HOT':
        case 'SORT_NEW':
        case 'SORT_RISING':
        case 'SORT_GILDED':
        case 'SORT_TOP':
        case 'SORT_T_DAY':
        case 'SORT_T_HOUR':
        case 'SORT_T_WEEK':
        case 'SORT_T_MONTH':
        case 'SORT_T_YEAR':
        case 'SORT_T_ALL':
        case 'ADD_SUBREDDITS':
        case 'REMOVE_SUBREDDITS':
        case 'NSFW':
            return true;
        case 'LOADING_COMPLETE':
            return action.more;
        case 'LOADING_FAILURE':
            return action.more;
        default:
            return state;
    }
}

export function sort(state = 'hot', action) {
    switch (action.type) {
        case 'SORT_HOT':
            return 'hot';
        case 'SORT_NEW':
            return 'new';
        case 'SORT_TOP':
            return 'top';
        case 'SORT_RISING':
            return 'rising';
        case 'SORT_GILDED':
            return 'gilded';
        default:
            return state;
    }
}

export function sortT(state = '', action) {
    switch (action.type) {
        case 'SORT_HOT':
            return '';
        case 'SORT_NEW':
            return '';
        case 'SORT_RISING':
            return '';
        case 'SORT_GILDED':
        case 'SORT_TOP':
        case 'SORT_T_DAY':
            return 'day';
        case 'SORT_T_HOUR':
            return 'hour';
        case 'SORT_T_WEEK':
            return 'week';
        case 'SORT_T_MONTH':
            return 'month';
        case 'SORT_T_YEAR':
            return 'year';
        case 'SORT_T_ALL':
            return 'all';
        default:
            return state;
    }
}

export function nsfw(state = true, action) {
    switch (action.type) {
        case 'NSFW':
            return action.nsfw;
        default:
            return state;
    }
}

export function notification(state = {}, action){
    switch(action.type){
        case 'DISPLAY_NOTIFICATION':
            return action.payload
        case 'REMOVE_NOTIFICATION':
            return {};
        default:
            return state
    }
}
