/*

{
	aspectRatio
	width
	height
	type
	title
	permalink
	direct
	data: {
		src
		srcset
		sources
		fallback
	}
}

 */

// verifies that all elements have the necessary data. removes those that do not
export default function process(post, elements, url, callback) {
    for (var i = elements.length - 1; i >= 0; i--) {
        var e = elements[i];
        
        if (typeof e.aspectRatio !== 'number' || typeof e.width !== 'number' ||
            typeof e.height !== 'number' || typeof e.type !== 'string' ||
            typeof e.title !== 'string' || typeof e.permalink !== 'string' ||
            typeof e.direct !== 'string' || typeof e.data === 'undefined') {
            elements.splice(i, 1);
        }
    }
    callback();
}
