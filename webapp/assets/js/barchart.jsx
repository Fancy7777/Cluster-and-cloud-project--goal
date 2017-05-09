"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
// import Highcharts from 'highcharts'
// require('highcharts-more')

// inspired from https://www.highcharts.com/demo/chart-update

class BarChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.barDistance = 10
		this.updateChart = this.updateChart.bind(this)
		this.myHeaders = new Headers({
			  "Authorization": "Basic " + btoa("cuser" + ":" + "JumpyMonk3y"),
			});
			// btoa(username + ":" + password)
		this.fetchOptions = {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
			headers: this.myHeaders
		}
		this.aurinDataBachelor = {
			"sydney": 43040,
			"melbourne": 25532,
			"adelaide": 4490,
			"brisbane": 173233,
			"canberra": 61827,
			"darwin": 8755,
			"hobart": 9901,
			"perth": 4199
		}
		this.plain = this.plain.bind(this)
		this.inverted = this.inverted.bind(this)
		this.polar = this.polar.bind(this)
		this.mapReduceMajorCityView = "http://115.146.94.41:5000/tweet_raw_trump/_design/trump_by_major_city/_view/trump_by_major_city"
		// this.mapReduceMajorCityView = "http://115.146.94.41:5000/tweet_raw/_design/trump_by_major_city/_view/trump_by_major_city?reduce=true"
		this.updateChart = this.updateChart.bind(this)
		this.majorCityData = null
	}

	fetchJsonData(url) {
		let json_data = fetch(url, this.fetchOptions)
			.then((response) => {return response.json()})
			.then((json) => {
				this.majorCityData = this.processMajorCityJsonToDrawingData(json)
				this.chartOption = {
				    chart: {
				        type: 'column'
				    },
				    title: {
				        text: this.props.chartTitle
				    },
				    subtitle: {
				        text: 'Source: www.twitter.com'
				    },
				    xAxis: {
						categories: this.majorCityData["categories"],
				        crosshair: true
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: 'rate'
				        }
				    },
				    tooltip: {
				        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				            '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>', // can add unit after {point.y:.1f}
				        footerFormat: '</table>',
				        shared: true,
				        useHTML: true
				    },
				    plotOptions: {
				        column: {
				            pointPadding: 0.2,
				            borderWidth: 0
				        }
				    },
				    series: this.majorCityData["dataSeries"]
				}
				// chartData {labels: [], series [[]...]}
				this.chart = Highcharts.chart(this.props.chartId, this.chartOption)})
			.catch((ex) => { console.log(' fetchJsonData => get json_data failed ', ex)
			})
	}

	processMajorCityJsonToDrawingData(majorCityJsonData) {

		console.log(" majorCityJsonData => " + Object.keys(majorCityJsonData))

		let values = majorCityJsonData.rows[0].value
		let cityKeySet = Object.keys(values)
		console.log(" cityKeySet => " + cityKeySet)
		let sentimentTagCategories = Object.keys(values[cityKeySet[0]])
		console.log(" sentimentTagCategories => " + sentimentTagCategories)
		let processedData = {}

		for(let i = 0; i < cityKeySet.length; i++) {
				processedData[cityKeySet[i]] = {}

		}

		for (let i = 0; i < cityKeySet.length; i++) {
			for (let j = 0; j < sentimentTagCategories.length; j++) {
				processedData[cityKeySet[i]][sentimentTagCategories[j]] =values[cityKeySet[i]][sentimentTagCategories[j]]
			}
		}

		let dataSeries = []
		let sumSentiment = {"pos":0, "neg": 0}

		if(this.props.need == "sumd") {
			let aurinDataSum = 0
			for (let i = 0; i < cityKeySet.length; i++) {
				aurinDataSum += this.props.chartData[cityKeySet[i]]
				console.log("aurinDataBachelorSum => " + aurinDataSum)
			}
			let aurinDataInGraph = []
			for(let i = 0; i < cityKeySet.length; i++) {
				console.log("bachelor rate => " + this.props.chartData[cityKeySet[i]]/aurinDataSum)
				aurinDataInGraph.push(this.props.chartData[cityKeySet[i]]/aurinDataSum)
			}
			dataSeries.push({"type":"column", "name": this.props.chartDataName, "data": aurinDataInGraph, colorIndex:5})
		} else if ( this.props.need == "d100") {
			let aurinDataInGraph = []
			for(let i = 0; i < cityKeySet.length; i++) {
				console.log("bachelor rate => " + this.props.chartData[cityKeySet[i]]/100)
				aurinDataInGraph.push(this.props.chartData[cityKeySet[i]]/100)
			}
			dataSeries.push({"type":"column", "name": this.props.chartDataName, "data": aurinDataInGraph, colorIndex:5})
		}



		for(let i = 0; i < sentimentTagCategories.length; i++) {
			if (sentimentTagCategories[i] != "pos") {
				if (sentimentTagCategories[i] != "neg") {
					console.log(" pass => " + sentimentTagCategories[i])
					continue
				}
			}
			let tempSentimentDataArray = []
			for(let j = 0; j < cityKeySet.length; j++) {
				tempSentimentDataArray.push(processedData[cityKeySet[j]][sentimentTagCategories[i]])
			}

			sumSentiment[sentimentTagCategories[i]] = tempSentimentDataArray.reduce((a, b) => a + b, 0)
			tempSentimentDataArray = tempSentimentDataArray.map((a) => { return (a/sumSentiment[sentimentTagCategories[i]]) })
			dataSeries.push({"type":"column", "name": sentimentTagCategories[i], "data": tempSentimentDataArray, colorIndex:i})
		}
		// console.log(" dataSeries name => " + dataSeries[0]["name"])
		// console.log(" dataSeries data => " + dataSeries[0]["data"])

		// let pointStart = [ -0.2, 0, 0]
		//
		// for(let i = 0; i < sentimentTagCategories.length; i++) {
		// 	let template = {
		// 		type: 'spline',
		// 		name: 'Average',
		// 		data: dataSeries[i]["data"],
		// 		dashStyle: "Solid",
		// 		pointStart: pointStart[0],
		// 		colorIndex: i,
		// 		marker: {
		// 			lineWidth: 2,
		// 			lineColor: "black",
		// 			fillColor: 'white',
		// 			radius: 2,
		// 		}
		// 	}
		//
		// 	dataSeries.push(template)

		// }
		return {"categories": cityKeySet, "dataSeries":dataSeries}
	}


	plain() {
	    this.chart.update({
	        chart: {
	            inverted: false,
	            polar: false
	        },
	        subtitle: {
	            text: 'Plain'
	        },
			series: this.majorCityData
		})
	}

	inverted() {
		this.chart.update({
	        chart: {
	            inverted: true,
	            polar: false
	        },
	        subtitle: {
	            text: 'Inverted'
	        },
			series: this.majorCityData
    	})
	}

	polar() {
		this.chart.update({
	        chart: {
	            inverted: false,
	            polar: true
	        },
	        subtitle: {
	            text: 'Polar'
	        }
	    })
	}

	componentDidMount() {
		this.fetchJsonData(this.mapReduceMajorCityView)

	}


	updateChart() {
		if (this.chart != null) {
			console.log("reflow")
			this.chart.destroy()
			this.chart = Highcharts.chart(this.props.chartId, this.chartOption)
		}

	}


	render() {
		return(
			<div>
					<div className={"charts"+this.props.chartId} id={this.props.chartId}></div>
						<button className={"btn btn-primary"} type={"button"} id={"plain-"+this.props.chartId} onClick={this.plain}>Plain</button>
						<button className={"btn btn-primary"} type={"button"} id={"inverted-"+this.props.chartId} onClick={this.inverted}>Inverted</button>
						<button className={"btn btn-primary"} type={"button"} id={"polar-"+this.props.chartId} onClick={this.polar}>Polar</button>
						<button className={"btn btn-primary"} type={"button"} id={"button-chart-" + this.props.chartId} onClick={this.updateChart}>Refresh</button>
			</div>

		)
	}

}
export default BarChart
