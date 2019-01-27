import parseUrl from 'url-parse'
import request from 'superagent'
import probe from 'probe-image-size'

const timeout = 4000
const CLIENT_ID = '';
const IMGUR_API_URI = 'https://api.imgur.com/3';

export default function process(post, elements, url, callback) {
    if (!url.host.match('(?:^|\.)imgur\.com$')) {
        callback();
        return;
    }

    // image links
    var match = url.pathname.match(/^\/([A-Za-z0-9]{5,7})[sbtmlh]?(?:\.|$)/); // get hashId from non album links
    if (match) {
        var hashId = match[1];

        // probe image for file type and make sure it hasnt been removed
        probe({
            url: `https://i.imgur.com/${hashId}.jpg`,
            timeout: timeout
        }, (err, result) => {
            if (!(err || typeof result.width !== 'number' || typeof result.height !== 'number' || typeof result.type !== 'string')) {
              if (result.url.startsWith('https://i.imgur.com/removed')) {
                  callback(true);
                  return;
              }

                //console.log('using probe result', result);

                // use probe results

                var fileExtension = result.type;
                var type = 'image';
                var direct = `https://i.imgur.com/${hashId}.${fileExtension}`;
                var sources = undefined;

                // handle gifs
                if (['gif', 'gifv', 'mp4'].indexOf(fileExtension) !== -1) {
                    type = 'image/gif';
                    fileExtension = 'gif';
                    direct = `https://i.imgur.com/${hashId}.gifv`;
                    sources = [{
                        src: `https://i.imgur.com/${hashId}.mp4`,
                        type: 'video/mp4'
                    }];
                }

                elements.push({
                    type,
                    direct,
                    width: result.width,
                    height: result.height,
                    data: {
                        src: `https://i.imgur.com/${hashId}.${fileExtension}`,
                        srcset: [
                            `https://i.imgur.com/${hashId}t.${fileExtension} 160w`, `https://i.imgur.com/${hashId}m.${fileExtension} 320w`, `https://i.imgur.com/${hashId}l.${fileExtension} 640w`, `https://i.imgur.com/${hashId}h.${fileExtension} 1024w`
                        ],
                        sources
                    }
                });

                callback();
                return;
            } else {
                // fallback use imgur api
                // get image information from imgur https://api.imgur.com/models/image
                request.get(`${IMGUR_API_URI}/image/${hashId}/`)
                    .set('Authorization', `Client-ID ${CLIENT_ID}`)
                    .set('Accept', 'application/json').timeout(timeout).end((err, res) => {

                        if (err) {
                            console.log('imgur api', err);
                            callback(typeof res !== 'undefined' && res.serverError && res.statusCode !== 429); // dont cache server errors 5xx or timeout
                            return;
                        }

                        if (typeof res.body.data !== 'undefined') {
                            const image = res.body.data;
                            if (typeof image.type === 'string' && typeof image.width === 'number' && typeof image.height === 'number') {

                                var match = image.link.match(/\.([A-Za-z]+)$/);
                                var fileExtension = match[1] || 'jpg';
                                var type = 'image';
                                var direct = `https://i.imgur.com/${hashId}.${fileExtension}`;
                                var sources = undefined;

                                // handle gifs
                                if (['gif', 'gifv', 'mp4'].indexOf(fileExtension) !== -1) {
                                    type = 'image/gif';
                                    fileExtension = 'gif';
                                    direct = `https://i.imgur.com/${hashId}.gifv`;
                                    sources = [{
                                        src: `https://i.imgur.com/${hashId}.mp4`,
                                        type: 'video/mp4'
                                    }];
                                }

                                elements.push({
                                    type,
                                    direct,
                                    width: image.width,
                                    height: image.height,
                                    data: {
                                        src: `https://i.imgur.com/${hashId}.${fileExtension}`,
                                        srcset: [
                                            `https://i.imgur.com/${hashId}t.${fileExtension} 160w`, `https://i.imgur.com/${hashId}m.${fileExtension} 320w`, `https://i.imgur.com/${hashId}l.${fileExtension} 640w`, `https://i.imgur.com/${hashId}h.${fileExtension} 1024w`
                                        ],
                                        sources
                                    }
                                });
                            }
                        }

                        callback();
                    });

                return;
            }

        });
        return;
    }

    // album links
    match = url.pathname.match(/^\/a\/([A-Za-z0-9]{5,7})$/); //get album hashId
    if (match) {
        var hashId = match[1];

        // get album images from imgur api https://api.imgur.com/models/album
        request.get(`${IMGUR_API_URI}/album/${hashId}/images`)
            .set('Authorization', `Client-ID ${CLIENT_ID}`)
            .set('Accept', 'application/json')
            .timeout(timeout)
            .end((err, res) => {
                if (err) {
                    console.log('imgur api', err);
                    callback(typeof res !== 'undefined' && res.serverError); // dont cache server errors 5xx or timeout
                    return;
                }

                // handle images
                if (Array.isArray(res.body.data)) {
                    var arr = [];
                    for (var image of res.body.data) {
                        if (typeof image.width === 'number' && typeof image.height === 'number' && typeof image.link === 'string') {
                            var match = parseUrl(image.link).pathname.match(/^\/([A-Za-z0-9]{5,7})[sbtmlh]?(?:\.|$)/); // get hashId
                            if (match) {
                                var hashId = match[1];
                                match = image.link.match(/\.([A-Za-z]+)$/);
                                var fileExtension = match[1] || 'jpg';

                                var match = image.link.match(/\.([A-Za-z]+)$/);
                                var fileExtension = match[1] || 'jpg';
                                var type = 'image';
                                var direct = `https://i.imgur.com/${hashId}.${fileExtension}`;
                                var sources = undefined;

                                // handle gifs
                                if (['gif', 'gifv', 'mp4'].indexOf(fileExtension) !== -1) {
                                    type = 'image/gif';
                                    fileExtension = 'gif';
                                    direct = `https://i.imgur.com/${hashId}.gifv`;
                                    sources = [{
                                        src: `https://i.imgur.com/${hashId}.mp4`,
                                        type: 'video/mp4'
                                    }];
                                }

                                elements.push({
                                    type,
                                    direct,
                                    width: image.width,
                                    height: image.height,
                                    data: {
                                        src: `https://i.imgur.com/${hashId}.${fileExtension}`,
                                        srcset: [
                                            `https://i.imgur.com/${hashId}t.${fileExtension} 160w`, `https://i.imgur.com/${hashId}m.${fileExtension} 320w`, `https://i.imgur.com/${hashId}l.${fileExtension} 640w`, `https://i.imgur.com/${hashId}h.${fileExtension} 1024w`
                                        ],
                                        sources
                                    }
                                });
                            }
                        }
                    }
                }
                callback();
            });
        return;
    }

    // gallery links
    match = url.pathname.match(/^\/gallery\/([A-Za-z0-9]{5,7})$/); //get gallery hashId
    if (match) {
        var hashId = match[1];

        // get gallery images from imgur api https://api.imgur.com/models/gallery/album
        request.get(`${IMGUR_API_URI}/gallery/album/${hashId}/images`)
            .set('Authorization', `Client-ID ${CLIENT_ID}`)
            .set('Accept', 'application/json')
            .timeout(timeout)
            .end((err, res) => {
                if (err) {
                    console.log('imgur api', err);
                    callback(typeof res !== 'undefined' && res.serverError); // dont cache server errors 5xx or timeout
                    return;
                }

                // handle images
                if (Array.isArray(res.body.data)) {
                    var arr = [];
                    for (var image of res.body.data) {
                        if (typeof image.width === 'number' && typeof image.height === 'number' && typeof image.link === 'string') {
                            var match = parseUrl(image.link).pathname.match(/^\/([A-Za-z0-9]{5,7})[sbtmlh]?(?:\.|$)/); // get hashId
                            if (match) {
                                var hashId = match[1];
                                match = image.link.match(/\.([A-Za-z]+)$/);
                                var fileExtension = match[1] || 'jpg';

                                var match = image.link.match(/\.([A-Za-z]+)$/);
                                var fileExtension = match[1] || 'jpg';
                                var type = 'image';
                                var direct = `https://i.imgur.com/${hashId}.${fileExtension}`;
                                var sources = undefined;

                                // handle gifs
                                if (['gif', 'gifv', 'mp4'].indexOf(fileExtension) !== -1) {
                                    type = 'image/gif';
                                    fileExtension = 'gif';
                                    direct = `https://i.imgur.com/${hashId}.gifv`;
                                    sources = [{
                                        src: `https://i.imgur.com/${hashId}.mp4`,
                                        type: 'video/mp4'
                                    }];
                                }

                                elements.push({
                                    type,
                                    direct,
                                    width: image.width,
                                    height: image.height,
                                    data: {
                                        src: `https://i.imgur.com/${hashId}.${fileExtension}`,
                                        srcset: [
                                            `https://i.imgur.com/${hashId}t.${fileExtension} 160w`, `https://i.imgur.com/${hashId}m.${fileExtension} 320w`, `https://i.imgur.com/${hashId}l.${fileExtension} 640w`, `https://i.imgur.com/${hashId}h.${fileExtension} 1024w`
                                        ],
                                        sources
                                    }
                                });
                            }
                        }
                    }
                }
                callback();
            });
        return;
    }

    callback();
}
