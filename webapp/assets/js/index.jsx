import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
// import Chartist from 'chartist'
import LineChart from './linechart.jsx'
import BarChart from './barchart.jsx'
import PieChart from './piechart.jsx'
import SideBar from './sidebar.jsx'
import Tab from './tab.jsx'
import HeatMapBox from './heatmapbox.jsx'

function sleep(delay)
{
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

class TestHelloWorld extends React.Component {
	render () {
		return (
			<div>
				{this.props.myWords.map((elem, index) => {return (<h1 key={index}> {elem} </h1>)})}
			</div>
		)
	}
}

// class RandomTwitterBox extends React.Component

class TwitterStreamBox extends React.Component {

	constructor(props) {
    	super(props)
    	this.state = {date: ""}
		this.limit = 1
		this.skip = 0
		this.includeDocs = true
		this.fetchOptions = { method: 'GET',
               headers: new Headers(),
               mode: 'cors',
               cache: 'default' }
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

				if (this.maxTweets == 0)
				{
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
		    	this.setState({ date: `Tweet text => ${text}, Place => ${placeName}`})})
			.catch((ex) => {
		    	console.log('parsing failed', ex)
		  	})
  	}

	render() {
		return(
			<h2> Stream Tweet: <br/> {this.state.date} </h2>
		)
	}
}


// let ajax_url = "https://script.googleusercontent.com/macros/echo?user_content_key=6dhhq9B18h7W-TaSRDEYWmeiqbClKxjidwn69RyAU_LRmR-fedpDm5BHwJ50yc-aGnjdLfv3dN0qgb6PVbeg8YYi4zJUGlMFm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJ9GRkcRevgjTvo8Dc32iw_BLJPcPfRdVKhJT5HNzQuXEeN3QFwl2n0M6ZmO-h7C6bwVq0tbM60-hWoa2zNWdeqVcgbF5zHdvQ&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk"
// ?limit={this.limit}&include_docs=true
let ajax_url = "http://115.146.95.52:9584/tweet_raw/_all_docs" // test db


let mapboxAccess = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl1YmluZ2ZlbmciLCJhIjoiY2lxN3pnYTlqMDB2cGZ5bTFmbHRyODU2OSJ9.GnnMuWeQ1EQ4RAgmttR-pg"

let mapid = "map"
// console.log("states => "+statesData.type)

var data = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [5, 2, 4, 2, 1]
  ]
}

var dataPie = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [5, 2, 4, 2, 1]
}

let ChartsMultiple = () => {
	return (
		<div>
			<LineChart chartId={"mychart1"} title={"Line Chart 1"} chartData={data}/>
			<BarChart chartId={"mychart2"} title={"Bar Chart 1"} chartData={data}/>
			<PieChart chartId={"mychart3"} title={"Pie Chart 1"} chartData={dataPie}/>
		</div>
	)
}

let sideBarData = [
					{"href":window.location.origin, "hrefName":"Home"},
					{"href":window.location.origin + "/about", "hrefName":"About"}
				]

if (document.getElementById('sidebar-wrapper')) {
	ReactDOM.render(<SideBar sideBarData={sideBarData}/>, document.getElementById('sidebar-wrapper'))
}
if (document.getElementById('container')) {
	ReactDOM.render(<TestHelloWorld myWords={["hello world ", "We are team GOAL"]}/>, document.getElementById('container'))
}

if (document.getElementById('twitter')) {
	ReactDOM.render(<TwitterStreamBox ajax_url={ajax_url}/>, document.getElementById('twitter'))
}
// ReactDOM.render(<ChartsMultiple />, document.getElementById('charts'))
// ReactDOM.render(<HeatMapBox title={"Heat Map"} mapboxAccessUrl={mapboxAccess} mapid={mapid}/>, document.getElementById('map-outer'))

if (document.getElementById('tabs')) {
ReactDOM.render(
				<Tab >
					<LineChart chartId={"mychart3"} title={"Line Chart tab"} chartData={data}/>
					<BarChart chartId={"mychart4"} title={"Bar Chart tab"} chartData={data}/>
					<PieChart chartId={"mychart5"} title={"Pie Chart tab"} chartData={dataPie}/>
				</Tab>, document.getElementById('tabs'))
}
