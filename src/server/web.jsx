import 'babel-polyfill'

import path from 'path'
import express from 'express'
import router from 'router'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import async from 'async'
import parseUrl from 'url-parse'
import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-redis'
import md5File from 'md5-file'
import Entities from 'html-entities'

import './util'
import AspectRatioHandler from './handlers/AspectRatioHandler'
import PreviewHandler from './handlers/PreviewHandler'
import ImgurHandler from './handlers/ImgurHandler'
import ProbeHandler from './handlers/ProbeHandler'
import PostDataHandler from './handlers/PostDataHandler'
import RedditHandler from './handlers/RedditHandler'
import DataVerifier from './handlers/DataVerifier'
import GfycatHandler from './handlers/GfycatHandler'
import {presets} from './index-config.js'

const app = express();
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../../views');
app.use('/', express.static(__dirname + '/../../public'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '1mb'}));
app.use(router());

const rVersion = md5File.sync(__dirname + '/../../public/js/r.js'); // use file hash to prevent client caching old file
app.get('/r(/*)?', function(req, res) {
    res.render('r', {version: rVersion});
});

app.get('/', function(req, res) {
    var nsfw = req.cookies.nsfw == 'true' || typeof req.cookies.nsfw === 'undefined';
    var sfw = req.cookies.sfw == 'true';

    res.render('index', {
        nsfw,
        sfw,
        presets: presets
    });
});

app.get('/health', function(req, res) {
    res.writeHead(200);
    res.end();
});

const handlers = [
    ImgurHandler,
    RedditHandler,
    GfycatHandler,
    PreviewHandler,
    ProbeHandler,
    AspectRatioHandler,
    PostDataHandler,
    DataVerifier
];
const entities = new Entities.AllHtmlEntities();

var config;
if (process.env.OPENSHIFT_REDIS_DB_HOST && process.env.OPENSHIFT_REDIS_DB_PORT && process.env.OPENSHIFT_REDIS_DB_PASSWORD) {
    config = {
        store: redisStore,
        host: process.env.OPENSHIFT_REDIS_DB_HOST,
        port: process.env.OPENSHIFT_REDIS_DB_PORT,
        auth_pass: process.env.OPENSHIFT_REDIS_DB_PASSWORD,
        db: 1,
        ttl: 72 * 60 * 60
    };
} else {
    config = {
        store: 'memory',
        max: 256,
        ttl: 24 * 60 * 60
    };
}
const cache = cacheManager.caching(config);

app.post('/api/content', function(req, res) {

    const posts = req.body.posts;

    if (typeof posts === 'undefined' || !Array.isArray(posts) || posts.length == 0 || posts.length > 100) {
        res.json([]);
        return;
    }

    var arr = [];
    async.eachLimit(posts, 25, (post, callback) => {
        if (typeof post === 'undefined' || typeof post.url === 'undefined' || typeof post.title === 'undefined' || typeof post.permalink === 'undefined') {
            callback();
            return;
        }

        //console.log('url', post.url);

        // check cache
        cache.get(post.url, (err, result) => {
            if (err) {
                console.log('cache err', err);
            }

            if (result) {
                //console.log('cached ', post.url);
                // dont use the cache title/permalink cause xss
                var title = entities.decode(post.title),
                    permalink = 'https://www.reddit.com' +  entities.decode(post.permalink);
                for (var element of result){
                  element.title = title;
                  element.permalink = permalink;
                }

                arr.pushArray(result);
                callback();
                return;
            }

            const start = new Date();
            var elements = [],
                url = parseUrl(entities.decode(post.url)),
                success = true;
            async.eachLimit(handlers, 1, (handler, innerCallback) => {
                if (success) {
                    handler(post, elements, url, (error) => {
                        if (error) {
                            success = false;
                        }
                        innerCallback();
                    });
                } else {
                    innerCallback();
                }
            }, (err) => {
                //console.log('url', post.url, (new Date() - start));
                if (err) {
                    console.log('handlers ', err);
                }

                if (success) {
                    // dont cache title/permalink
                    var toCache = JSON.parse(JSON.stringify(elements));
                    for (var element of toCache){
                      delete element.title;
                      delete element.permalink;
                    }
                    cache.set(post.url, toCache);
                    arr.pushArray(elements);
                }

                callback();
            });
        });

    }, (err) => {
        if (err) {
            console.log('thumbnails ', err);
        }

        //console.log(posts.length + ' ' + arr.length);
        res.json(arr);
    });
});

app.get('*', (req, res) => {
    res.status(404);
    res.end();
});

var server = app.listen(process.env.OPENSHIFT_NODEJS_PORT || 3001, process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1', function() {
    console.log('Express is listening to ' + (process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1') + ':' + (process.env.OPENSHIFT_NODEJS_PORT || 3001));
});
