// calculates aspectRatio from width and height
export default function process(post, elements, url, callback) {
    for (var element of elements) {
        if (typeof element.aspectRatio === 'undefined' &&
            typeof element.width === 'number' && typeof element.height === 'number') {
            element.aspectRatio = element.width / element.height;
        }
    }
    callback();
}
