import Entities from 'html-entities'

const entities = new Entities.AllHtmlEntities();

// uses preview data from reddit post
export default function process(post, elements, url, callback) {
    if (elements.length === 1 && typeof post.preview === 'object') {
        var img = post.preview.images[0];
        var element = elements[0];
        if (['image', 'image/gif'].indexOf(element.type) !== -1) {
            //srcset
            if (typeof element.data.srcset === 'undefined') {
                element.data.srcset = [
                    img.source, ...img.resolutions
                ].map(res => {
                    if (typeof res === 'object' && typeof res.url === 'string' && typeof res.width === 'number' && typeof res.height === 'number') {
                        const decoded = entities.decode(res.url);
                        return `${decoded} ${res.width}w`;
                    }
                });
            }

            // width, height
            if (typeof element.width === 'undefined' || typeof element.height === 'undefined') {
                element.width = img.source.width;
                element.height = img.source.height;
            }
        }
    }

    callback();
}
