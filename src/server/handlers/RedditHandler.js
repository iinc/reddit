// uses preview data from reddit post
export default function process(post, elements, url, callback) {
    
    if (elements.length === 0 && (['i.reddituploads.com', 'i.redd.it'].indexOf(url.host) !== -1)) {
        var type = 'image';
        if (url.pathname.match(/\.gif$/))
          type = 'image/gif';

        elements.push({
            type,
            direct: url.href,
            data: {
                src: url.href
            }
        });

    }
    callback();
}
