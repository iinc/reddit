# Reddit Image Gallery

Responsive image gallery that displays images from reddit. Supports viewing multiple subreddits, sorting content by hot/top/new/rising, viewing single image in lightbox, and playing embedded videos/gifs.


Frontend built with React and Redux. Image gallery forked from [react-images](https://github.com/jossmac/react-images).

Backend built Node.js. Backend processes reddit posts: extracts images/videos urls, makes API calls to image hosting services, and figures out thumbnail dimensions. Processing results cached using Redis.


Video demonstrating functionality:
[https://www.youtube.com/watch?v=DwOis6zAPQI](https://www.youtube.com/watch?v=DwOis6zAPQI)


![](public/images/1.png?raw=true)
![](public/images/2.png?raw=true)


