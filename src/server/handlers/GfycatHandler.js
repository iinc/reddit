import parseUrl from 'url-parse'
import probe from 'probe-image-size'
import request from 'superagent'

const timeout = 8000;

export default function process(post, elements, url, callback) {

    if (!url.host.match('(?:^|\.)gfycat\.com$')) {
        callback();
        return;
    }

    // image links
    var match = url.pathname.match(/^\/([A-Za-z0-9]+)(?:\.|$)/); // get gfyName
    if (match) {
        const gfyName = match[1];

        // get the gif dimensions
        probe({
            url: `https://thumbs.gfycat.com/${gfyName}-poster.jpg`,
            timeout: timeout
        }, (err, result) => {
            if (err || typeof result.width !== 'number' || typeof result.height !== 'number') {
                callback(true);
                return;
            }

            const aspectRatio = result.width / result.height;

            elements.push({
              width: result.width,
              height: result.height,
              aspectRatio: aspectRatio,
              type: 'gfycat',
              direct: `https://gfycat.com/${gfyName}`,
              data: {
                  src: `https://thumbs.gfycat.com/${gfyName}-poster.jpg`,
                  srcset: [
                      // these are cropped and weird
                      // `https://thumbs.gfycat.com/${gfyName}-thumb360.jpg ${Math.floor(aspectRatio * 360)}w`,
                      // `https://thumbs.gfycat.com/${gfyName}-thumb100.jpg ${Math.floor(aspectRatio * 100)}w`
                  ],
                  gfyName: gfyName
              }
            });
            callback();
        });

        return;
    }

    callback();
}
