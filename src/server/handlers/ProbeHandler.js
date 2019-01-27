import probe from 'probe-image-size'
import async from 'async'
import parseUrl from 'url-parse'

const timeout = 5000;

const whitelisted = ['i.reddituploads.com', 'i.redd.it', 'i.imgur.com'];

// probes images for their size
export default function process(post, elements, url, callback) {

    // probe direct link
    if (elements.length === 0) {
        // TODO whitelist urls?
        if (whitelisted.indexOf(url.host) === -1) {
            callback();
            return;
        }

        probe({
            url: url.href,
            timeout: timeout
        }, (err, result) => {
            if (err || typeof result.width !== 'number' || typeof result.height !== 'number') {
                callback(true);
                return;
            }

            if (result.url.startsWith('https://i.imgur.com/removed')){
                callback(true);
                return;
            }

            elements.push({
                type: 'image',
                width: result.width,
                height: result.height,
                direct: url.href,
                data: {
                    src: url.href
                }
            });
            callback();
        });
    } else {
        // TODO how to pass callback error from innerCallback
        async.eachLimit(elements, 25, (element, innerCallback) => {
            if (['image', 'image/gif'].indexOf(element.type) !== -1 &&
                typeof element.data.src !== 'undefined' &&
                (typeof element.width !== 'number' || typeof element.height !== 'number')) {

                probe({
                    url: element.data.src,
                    timeout: timeout
                }, (err, result) => {
                    if (err || typeof result.width !== 'number' || typeof result.height !== 'number') {
                        innerCallback();
                        return;
                    }

                    element.width = result.width;
                    element.height = result.height;
                    innerCallback();
                });
                return;
            }
            innerCallback();
        }, (err) => {
            if (err) {
                console.log('probe handler ', err);
            }
            callback();
        });
    }

}
