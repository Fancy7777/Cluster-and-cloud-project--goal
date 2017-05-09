// class RandomTwitterBox extends React.Component
"use strict"
import React from 'react'
import ReactDOM from 'react-dom'

class TwitterStreamBox extends React.Component {

	constructor(props) {
    	super(props)
    	this.state = {date: ""}
		this.limit = 1
		this.skip = 0
		this.includeDocs = true
		this.fetchOptions = {
			method: 'GET',
           	mode: 'cors',
            cache: 'default'
		}
		this.tick = this.tick.bind(this)
		this.maxTweets = 0
		// http://115.146.95.52:9584/tweet_raw/_all_docs?limit=1&include_docs=true&skip=1
	}

	componentDidMount() {
		this.tick()
    	this.timerID = setInterval(
	      	() => this.tick(),
	      	10000
    	)
	}

	componentWillUnmount() {
    	clearInterval(this.timerID);
  	}

	tick() {
		fetch(`${this.props.ajax_url}?limit=${this.limit}&include_docs=${this.includeDocs}&skip=${this.skip}`,  this.fetchOptions)
			.then((response) => {
		    	return response.json()})
			.then((json) => {
				console.log(" => " + json.rows[0].doc.created_at)
				let placeName = ""
				let text = ""

				if (this.maxTweets == 0) {
					// total_rows is not safe to use, it also include view's rows
					this.maxTweets = json.total_rows
				}

				try {

					if (json.rows[0].doc.text != null) {
						text = json.rows[0].doc.text
					}

					// some tweets has no place, prevent place trigger exceptio frist so put it here
					if (json.rows[0].doc.place.name != null) {
						placeName =json.rows[0].doc.place.name
					}

				}
				catch(e) {
					if (e instanceof TypeError) {
						console.log('type error, some field is not present', e)
					}
					else {
						throw e
					}

				}

				if (this.skip <= this.maxTweets && this.maxTweets != 0 ) {
					this.skip += 1
				}
				else {
					this.skip = 0
				}
		    	this.setState({ date: `${text}`})})
			.catch((ex) => {
		    	console.log('parsing failed', ex)
		  	})
  	}

	render() {
		return(
			<h2> {this.state.date} </h2>
		)
	}
}

export default TwitterStreamBox
