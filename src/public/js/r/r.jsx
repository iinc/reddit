import 'babel-polyfill';

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import Cookies from 'cookies-js'

import * as reducers from './reducers.js'
import Container from './Container'
import './util'
import {parseSubreddits} from './UrlHandler'

const reducer = combineReducers(reducers);

// Grab the state from a global injected into server-generated HTML
var initialState = window.__INITIAL_STATE__;

// get initial state of subreddits from url
if (typeof initialState === 'undefined') {
    initialState = {
        subreddits: parseSubreddits(),
        nsfw: Cookies.get('nsfw') !== 'false' // defaults to true
    }
}

let store = createStore(reducer, initialState, applyMiddleware(thunk));

function render() {
    ReactDOM.render(
        <Provider store={store}>
        <Container elements={store.getState().elements} loading={store.getState().loading} subreddits={store.getState().subreddits} more={store.getState().more} sort={store.getState().sort} sortT={store.getState().sortT} nsfw={store.getState().nsfw} notification={store.getState().notification}/>
    </Provider>, document.getElementById('content'));
}

store.subscribe(render);
render();
