import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
// import Chartist from 'chartist'
import LineChart from './linechart.jsx'
import BarChart from './barchart.jsx'
import PieChart from './piechart.jsx'
import SideBar from './sidebar.jsx'
import Tab from './tab.jsx'
import HeatMapBox from './HeatMapBox.jsx'

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
	}

	componentDidMount() {
    	this.timerID = setInterval(
	      	() => this.tick(),
	      	1000
    	)
	}

	componentWillUnmount() {
    	clearInterval(this.timerID);
  	}

	tick() {
		fetch(this.props.ajax_url)
			.then((response) => {
		    	return response.json()})
			.then((json) => {
		    	this.setState({ date: "full date => " + json.fulldate})})
			.catch((ex) => {
		    	console.log('parsing failed', ex)
		  	})
  	}

	render() {
		return(
			<h2> Current time: <br/> {this.state.date} </h2>
		)
	}
}


let ajax_url = "https://script.googleusercontent.com/macros/echo?user_content_key=6dhhq9B18h7W-TaSRDEYWmeiqbClKxjidwn69RyAU_LRmR-fedpDm5BHwJ50yc-aGnjdLfv3dN0qgb6PVbeg8YYi4zJUGlMFm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJ9GRkcRevgjTvo8Dc32iw_BLJPcPfRdVKhJT5HNzQuXEeN3QFwl2n0M6ZmO-h7C6bwVq0tbM60-hWoa2zNWdeqVcgbF5zHdvQ&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk"

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
					{"href":"#", "hrefName":"Home"},
					{"href":"#", "hrefName":"About"}
				]
ReactDOM.render(<SideBar sideBarData={sideBarData}/>, document.getElementById('sidebar-wrapper'))
ReactDOM.render(<TestHelloWorld myWords={["hello world ", "We are team GOAL"]}/>, document.getElementById('container'))
ReactDOM.render(<TwitterStreamBox ajax_url={ajax_url}/>, document.getElementById('twitter'))
// ReactDOM.render(<ChartsMultiple />, document.getElementById('charts'))
ReactDOM.render(<HeatMapBox title={"Heat Map"} mapboxAccessUrl={mapboxAccess} mapid={mapid}/>, document.getElementById('map-outer'))
ReactDOM.render(
				<Tab >
					<LineChart chartId={"mychart3"} title={"Line Chart tab"} chartData={data}/>
					<BarChart chartId={"mychart4"} title={"Bar Chart tab"} chartData={data}/>
					<PieChart chartId={"mychart5"} title={"Pie Chart tab"} chartData={dataPie}/>
				</Tab>, document.getElementById('tabs'))
