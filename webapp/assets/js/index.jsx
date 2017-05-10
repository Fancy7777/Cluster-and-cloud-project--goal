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
import TwitterStreamBox from './twitterstreambox.jsx'
// function sleep(delay)
// {
// 	var start = new Date().getTime();
// 	while (new Date().getTime() < start + delay);
// }

class TestHelloWorld extends React.Component {
	render () {
		return (
			<div>
				{this.props.myWords.map((elem, index) => {return (<h1 key={index}> {elem} </h1>)})}
			</div>
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

let aurinDataHumanCaptialName = "bachelor"

let chartTitleHuamn = "Sentimen Analysis of people's postive and negative attitude rate for Trump vs bachelor rate of each Australia's major city"
let aurinDataHumanCaptial = {
		"sydney": 43040,
		"melbourne": 25532,
		"adelaide": 4490,
		"brisbane": 173233,
		"canberra": 61827,
		"darwin": 8755,
		"hobart": 9901,
		"perth": 4199
	}
let aurinDataLabor1Name = "unskilled"
let chartTitleLabor1 = "Sentimen Analysis of people's postive and negative attitude rate for Trump vs unskilled worker rate of each Australia's major city"
let aurinDataLabor1 = {
	"adelaide": 6.334666495,
	"melbourne": 4.470647406,
	"sydney": 5.683079863,
	"perth": 8.431044109,
	"darwin": 12.22276001,
	"brisbane":12.65861759,
	"hobart":6.498422713,
	"canberra":0
}

let aurinDataLabor2Name = "manager"
let chartTitleLabor2 = "Sentimen Analysis of people's postive and negative attitude rate for Trump vs manager rate of each Australia's major city"
let aurinDataLabor2 = {
	"adelaide": 48.92271965,
	"melbourne": 49.15476822,
	"sydney": 46.27927393,
	"perth": 45.63558533,
	"darwin": 30.24798565,
	"brisbane": 33.15673842,
	"hobart": 42.98212408,
	"canberra":0
}

// <LineChart chartId={"mychart3"} title={"Line Chart"} chartData={data}/>

if (document.getElementById('tabs')) {
ReactDOM.render(
				<Tab >
					<BarChart chartId={"mychart4"} title={"Bar Chart Bachelor"} chartTitle={chartTitleHuamn} need={"sumd"} chartDataName={aurinDataHumanCaptialName} chartData={aurinDataHumanCaptial}>
						<p>
							According to the above bar chart, we use the human capital dataset from
							AURIN to do this analysis. We find that in Melbourne and Sydney, the
							number of people who has bachelor degree is quite small. And people
							without bachelor degrees tend to support Trump. On the contrary, by
							observing the bar chart in Brisbane and Canberra, more people gain their
							bachelor degrees in these cities, they are not supporting Trump as
							Melbourne and Sydney does. This means Trump is advocated by those people
							with less education. This is actually the same as media reported. Trump&#39;s
							 policy is beneficial to workers. And Hillary is good for high-class people.
						</p>
				<HeatMapBox title={"Heat Map"} mapboxAccessUrl={mapboxAccess} mapid={mapid}/>
					</BarChart>
					<BarChart chartId={"mychart5"} title={"Bar Chart Unskilled"} chartTitle={chartTitleLabor1} need={"d100"} chartDataName={aurinDataLabor1Name} chartData={aurinDataLabor1}>
						<p>
							According to the above bar chart, we use LGA Labour Force dataset from AURIN to do this analysis.
							It is easy to see that the percent of unskilled and semi-skilled workers is low in Melbourne and
							Sydney, while there are more unskilled and semi-skilled workers in Brisbane, Darwin and Hobart.
							This also shows that Trump is advocated by those people with less income. This is actually the same
							as the reality. Trump&#39;s policy is beneficial to workers.
						</p>
					</BarChart>
					<BarChart chartId={"mychart6"} title={"Bar Chart Manager"} chartTitle={chartTitleLabor2} need={"d100"} chartDataName={aurinDataLabor2Name} chartData={aurinDataLabor2}>
						<p>
							According to the above bar chart, we use LGA Labour Force dataset from AURIN to do this analysis.
							We can see that that the proportion of managers, administrators and
							professionals is high in Sydney and Melbourne, while the rate is low in Brisbane, Darwin and Hobart.
							This also shows that Trump got more objections by those people with higher
							status. This is actually the same as media reported.
							Trump's policy is not beneficial to the rich. And Hillary is good for high-class people.
						</p>
					</BarChart>
					<PieChart chartId={"mychart7"} title={"Pie Chart"} chartData={dataPie}/>
				</Tab>, document.getElementById('tabs'))
}
