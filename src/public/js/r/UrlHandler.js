export function parseSubreddits() {
    var path = window.location.pathname;
    if (path.indexOf('/r/') === 0) {
        return path.substring(3).split('+').filter(s => s !== '');
    }
    return [];
}

export function updateUrl(subreddits) {
    if (subreddits.length === 0) {
        window.history.replaceState('', '', '/r/'); //clear url
        return;
    }

    //rebuild url
    var uriString = '/r/';
    var first = true;
    for (var subreddit of subreddits) {
        uriString += (first ? '' : '+') + subreddit;
        first = false;
    }

    window.history.replaceState('', '', encodeURI(uriString));
}
