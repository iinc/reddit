import React from 'react'
import Autosuggest from 'react-autosuggest'

import subreddits from './AddSubredditData'
import {addSubreddit} from './Loader'

const SUGGESTIONS_LENGTH = 10;

var AddSubredditOption = React.createClass({
    propTypes: {
        nsfw: React.PropTypes.bool.isRequired
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    getInitialState: function() {
        return {value: '', suggestions: []};
    },
    componentDidMount: function() {
        //this.input.focus();
    },
    getSuggestionValue: function(suggestion) {
        return suggestion.display_name;
    },
    getSuggestions: function(value) {
        const escapedValue = value.replace(/\W*/g, '').toLowerCase();
        if (escapedValue === '') {
            return [];
        }

        var list = subreddits.filter(sub => sub.display_name.toLowerCase().indexOf(escapedValue) !== -1 && (this.props.nsfw || !sub.over18))
        //.sort((a, b) => b.subscribers - a.subscribers); // already sorted
        if (list.length > SUGGESTIONS_LENGTH){
          list = list.splice(0, SUGGESTIONS_LENGTH);
        }
        return list;
    },
    onChange: function(event, {newValue, method}) {
        this.setState({value: newValue});
    },
    onKeyPress: function(event) {
        if (!event)
            event = window.event;
        var keyCode = event.keyCode || event.which;
        if (keyCode == '13') {
            if (this.input.value !== '') {
                this.setState({value: ''});
                this.context.store.dispatch(addSubreddit(this.input.value));
            }
            return false;
        }
    },
    onSuggestionSelected: function(event, {suggestion, suggestionValue, sectionIndex, method}) {
        this.setState({value: ''});
        this.context.store.dispatch(addSubreddit(suggestionValue));
    },
    onSuggestionsFetchRequested: function({value}) {
        this.setState({suggestions: this.getSuggestions(value)});
    },
    onSuggestionsClearRequested: function() {
        this.setState({suggestions: []});
    },
    storeInputReference: function(autosuggest) {
        if (autosuggest !== null) {
            this.input = autosuggest.input;
        }
    },
    renderSuggestion: function(suggestion, { query }) {
        const startIndex = suggestion.display_name.toLowerCase().indexOf(query.toLowerCase());
        const endIndex = startIndex + query.length;

        const part1 = suggestion.display_name.substring(0, startIndex);
        const part2 = suggestion.display_name.substring(startIndex, endIndex);
        const part3 = suggestion.display_name.substring(endIndex);

        return (
            <span>{part1}<b>{part2}</b>{part3}</span>
        );
    },
    render: function() {

        return (
            <div id={'add-subreddit'}>
                <Autosuggest suggestions={this.state.suggestions} onSuggestionsFetchRequested={this.onSuggestionsFetchRequested} onSuggestionsClearRequested={this.onSuggestionsClearRequested} getSuggestionValue={this.getSuggestionValue} onSuggestionSelected={this.onSuggestionSelected} renderSuggestion={this.renderSuggestion} inputProps={{
                    placeholder: 'Add a subreddit',
                    value: this.state.value,
                    onChange: this.onChange,
                    onKeyPress: this.onKeyPress
                }} ref={this.storeInputReference}/>
                <button onClick={() => {
                    if (this.state.value !== '') {
                        this.context.store.dispatch(addSubreddit(this.state.value));
                        this.setState({value: ''});
                    }
                }} type="button">Add</button>
            </div>
        );
    }
});

export default AddSubredditOption;
