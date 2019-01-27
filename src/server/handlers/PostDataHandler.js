import Entities from 'html-entities'

const entities = new Entities.AllHtmlEntities();

export default function process(post, elements, url, callback) {
    for (var element of elements) {
        // title
        if (typeof element.title === 'undefined') {
            element.title = entities.decode(post.title);
        }

        // permalink
        if (typeof element.permalink === 'undefined') {
            element.permalink = typeof post.permalink === 'string' ?
                'https://www.reddit.com' + entities.decode(post.permalink) :
                undefined;
        }

        if (typeof element.direct === 'undefined'){
            element.direct = url.href;
        }
    }

    callback();
}
