import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
import L from 'leaflet'
require ('leaflet.heat')
import addressPoints from './realworld.10000.js'
import melbourneGeo from './melbourneGeo.js'
import Chartist from 'chartist'
import LineChart from './linechart.jsx'
import BarChart from './barchart.jsx'
import PieChart from './piechart.jsx'
import SideBar from './sidebar.jsx'
import Tab from './tab.jsx'
// var React = require('react')
// var ReactDOM = require('react-dom')
//
// var Hello = React.createClass ({
//     render: () => {
//         return (
//             <h1>
//             Hello, React!!!! =>
//             </h1>
//         )
//     }
// })


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

class HeatMapBox extends React.Component{

	constructor(props) {
    	super(props)
	}

	componentDidMount() {
		// Mel
		// let mymap = L.map(this.props.mapid).setView([50.5, 30.5], 12)
		let mymap = L.map(this.props.mapid).setView([-37.7963689,144.9589851], 10)
		L.tileLayer(this.props.mapboxAccessUrl, {
			maxZoom: 18,
		}).addTo(mymap)

		L.geoJson(melbourneGeo).addTo(mymap)

		let points = addressPoints.map((p) => { return [p[0], p[1]] })
		// console.log("points => " + points[0] );
		// console.log("L.heatLayer => " + L.heatLayer );
		let heat = L.heatLayer(points, {minOpacity: 0.1}).addTo(mymap);
		// console.log("heat => " + heat);

		let latlong = []
		let latBound = 90
		let longBound = 180
		let minLat = -37.875343
		let maxLat = -37.653601
		let minLon = 144.726292
		let maxLon = 145.184971
		this.timerID = setInterval(
	      	() => {
					// for bound range neg and pos
					// latlong = [Math.random()*(Math.random() < 0.5 ? -1 : 1) * latBound, Math.random()*(Math.random() < 0.5 ? -1 : 1) * longBound]
					//console.log("lat lon =>" + latlog)
					latlong = [Math.random()*(maxLat-minLat)+minLat, Math.random()*(maxLon-minLon)+minLon, 1]
					// console.log("lat lon =>" + latlong)
					heat.addLatLng(latlong)},
	      	100
    	)

	}

	render() {
		return(
				<div>
					<h1>Heat Map</h1>
					<div id={this.props.mapid} style={{height:"250px", width:"500px", position:"relative"}}></div>
				</div>
		)
	}
}


// class Charts extends React.Component {
//
// 	constructor(props) {
//     	super(props)
// 	}
//
// 	render() {
// 		return (
//
// 		)
// 	}
//
// }



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
ReactDOM.render(<ChartsMultiple />, document.getElementById('charts'))
ReactDOM.render(<HeatMapBox title={"Heat Map"} mapboxAccessUrl={mapboxAccess} mapid={mapid}/>, document.getElementById('map-outer'))
ReactDOM.render(
				<Tab >
					<LineChart chartId={"mychart1"} title={"Line Chart tab"} chartData={data}/>
					<BarChart chartId={"mychart2"} title={"Bar Chart 1"} chartData={data}/>
				</Tab>, document.getElementById('tabs'))



// var data1 = {
//   // A labels array that can contain any sort of values
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   // Our series array that contains series objects or in this case series data arrays
//   series: [
//     [5, 2, 4, 2, 0]
//   ]
// };
//
// var data2 = {
//   // A labels array that can contain any sort of values
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   // Our series array that contains series objects or in this case series data arrays
//   series: [
//     [5, 2, 4, 2, 10]
//   ]
// };
//
//
// // Create a new line chart object where as first parameter we pass in a selector
// // that is resolving to our chart container element. The Second parameter
// // is the actual data object.
// let chart1 = new Chartist.Line('#chart1', data1)
// let chart2 = new Chartist.Line('#chart2', data2)
//
//
// // Let's put a sequence number aside so we can use it in the event callbacks
// var seq = 0;
//
// // Once the chart is fully created we reset the sequence
// chart1.on('created', function() {
//   seq = 0;
// });
//
// // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
// chart1.on('draw', (data) => {
//   if(data.type === 'point') {
//     // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
//     data.element.animate({
//       opacity: {
//         // The delay when we like to start the animation
//         begin: seq++ * 80,
//         // Duration of the animation
//         dur: 500,
//         // The value where the animation should start
//         from: 0,
//         // The value where it should end
//         to: 1
//       },
//       x1: {
//         begin: seq++ * 80,
//         dur: 500,
//         from: data.x - 100,
//         to: data.x,
//         // You can specify an easing function name or use easing functions from Chartist.Svg.Easing directly
//         easing: Chartist.Svg.Easing.easeOutQuart
//       }
//     });
//   }
// });
//
// // For the sake of the example we update the chart every time it's created with a delay of 8 seconds
// chart1.on('created', () => {
//   if(window.__anim0987432598723) {
//     clearTimeout(window.__anim0987432598723);
//     window.__anim0987432598723 = null;
//   }
//   window.__anim0987432598723 = setTimeout(chart1.update.bind(chart1), 8000);
// });
//
//
// new Chartist.Line('#chart3', {
//   series: [[
//     {x: 1, y: 100},
//     {x: 2, y: 50},
//     {x: 3, y: 25},
//     {x: 5, y: 12.5},
//     {x: 8, y: 6.25}
//   ]]
// }, {
//   axisX: {
//     type: Chartist.AutoScaleAxis,
//     onlyInteger: true
//   }
// });


// var chart = new Chartist.Line('#chart1', {
//   labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//   series: [
//     [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
//     [4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
//     [5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
//     [3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
//   ]
// }, {
//   low: 0
// });
//
// // Let's put a sequence number aside so we can use it in the event callbacks
// var seq = 0,
//   delays = 80,
//   durations = 500;
//
// // Once the chart is fully created we reset the sequence
// chart.on('created', function() {
//   seq = 0;
// });
//
// // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
// chart.on('draw', function(data) {
//   seq++;
//
//   if(data.type === 'line') {
//     // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
//     data.element.animate({
//       opacity: {
//         // The delay when we like to start the animation
//         begin: seq * delays + 1000,
//         // Duration of the animation
//         dur: durations,
//         // The value where the animation should start
//         from: 0,
//         // The value where it should end
//         to: 1
//       }
//     });
//   } else if(data.type === 'label' && data.axis === 'x') {
//     data.element.animate({
//       y: {
//         begin: seq * delays,
//         dur: durations,
//         from: data.y + 100,
//         to: data.y,
//         // We can specify an easing function from Chartist.Svg.Easing
//         easing: 'easeOutQuart'
//       }
//     });
//   } else if(data.type === 'label' && data.axis === 'y') {
//     data.element.animate({
//       x: {
//         begin: seq * delays,
//         dur: durations,
//         from: data.x - 100,
//         to: data.x,
//         easing: 'easeOutQuart'
//       }
//     });
//   } else if(data.type === 'point') {
//     data.element.animate({
//       x1: {
//         begin: seq * delays,
//         dur: durations,
//         from: data.x - 10,
//         to: data.x,
//         easing: 'easeOutQuart'
//       },
//       x2: {
//         begin: seq * delays,
//         dur: durations,
//         from: data.x - 10,
//         to: data.x,
//         easing: 'easeOutQuart'
//       },
//       opacity: {
//         begin: seq * delays,
//         dur: durations,
//         from: 0,
//         to: 1,
//         easing: 'easeOutQuart'
//       }
//     });
//   } else if(data.type === 'grid') {
//     // Using data.axis we get x or y which we can use to construct our animation definition objects
//
// 	// console.log("data.axis.units.pos  => " + (data.axis.units.pos))
// 	// console.log("data.axis.units.pos 1=> " + (data.axis.units.pos + '1'))
// 	// console.log("data.axis.units.pos 2=> " + (data.axis.units.pos + '2'))
// 	//
// 	//
// 	// console.log("data => data.axis.units.pos  => " + (data[data.axis.units.pos]))
// 	// console.log("data => data.axis.units.pos 1=> " + (data[data.axis.units.pos + '1']))
// 	// console.log("data => data.axis.units.pos 2=> " + (data[data.axis.units.pos + '2']))
//
//     var pos1Animation = {
//       begin: seq * delays,
//       dur: durations,
//       from: data[data.axis.units.pos + '1'] - 30,
//       to: data[data.axis.units.pos + '1'],
//       easing: 'easeOutQuart'
//     };
//
//     var pos2Animation = {
//       begin: seq * delays,
//       dur: durations,
//       from: data[data.axis.units.pos + '2'] - 100,
//       to: data[data.axis.units.pos + '2'],
//       easing: 'easeOutQuart'
//     };
//
//     var animations = {};
//     animations[data.axis.units.pos + '1'] = pos1Animation;
//     animations[data.axis.units.pos + '2'] = pos2Animation;
//     animations['opacity'] = {
//       begin: seq * delays,
//       dur: durations,
//       from: 0,
//       to: 1,
//       easing: 'easeOutQuart'
//     };
//
//     data.element.animate(animations);
//   }
// });
//
// // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
// chart.on('created', function() {
//   if(window.__exampleAnimateTimeout) {
//     clearTimeout(window.__exampleAnimateTimeout);
//     window.__exampleAnimateTimeout = null;
//   }
//   window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
// });
