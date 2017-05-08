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
		this.fetchOptions = {
			method: 'GET',
			mode: 'cors',
			cache: 'default'
		}
		this.plain = this.plain.bind(this)
		this.inverted = this.inverted.bind(this)
		this.polar = this.polar.bind(this)
		this.mapReduceMajorCityView = "http://115.146.94.41:5000/tweet_raw_trump/_design/trump_by_major_city/_view/trump_by_major_city"
	}

	fetchJsonData(url) {
		let json_data = fetch(url, this.fetchOptions)
			.then((response) => {return response.json()})
			.then((json) => {
				let majorCityData = this.processMajorCityJsonToDrawingData(json)

				// chartData {labels: [], series [[]...]}
				this.chart = Highcharts.chart(this.props.chartId, {
				    chart: {
				        type: 'column'
				    },
				    title: {
				        text: "Sentimen Analysis of people's attitudes for Trump"
				    },
				    subtitle: {
				        text: 'Source: www.twitter.com'
				    },
				    xAxis: {
				        // categories: [
						// 	// this.props.categories
						// 	"Positive", "Negative", "Compound", "Neutral"
				        // ],
						categories: majorCityData["categories"],
				        crosshair: true
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: 'number'
				        }
				    },
				    tooltip: {
				        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>', // can add unit after {point.y:.1f}
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
				    series: majorCityData["dataSeries"]
				})


			} )
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
			processedData[cityKeySet[i]] = []
		}

		for (let i = 0; i < cityKeySet.length; i++) {
			for (let j = 0; j < sentimentTagCategories.length; j++) {
				processedData[cityKeySet[i]].push(values[cityKeySet[i]][sentimentTagCategories[j]])
			}
		}



		let dataSeries = []


		for(let i = 0; i < cityKeySet.length; i++) {
			dataSeries.push({"name": cityKeySet[i], "data": processedData[cityKeySet[i]]})
		}
		console.log(" dataSeries name => " + dataSeries[0]["name"])
		console.log(" dataSeries data => " + dataSeries[0]["data"])

		return {"categories": sentimentTagCategories, "dataSeries":dataSeries}
	}


	plain() {
	    this.chart.update({
	        chart: {
	            inverted: false,
	            polar: false
	        },
	        subtitle: {
	            text: 'Plain'
	        }
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
	        }
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


	updateChart()
	{
		if (this.chart != null)
		{
			this.chart.update(this.props.chartData, this.options, false)
		}

	}


	render() {
		return(
			<div>
					<h2> {this.props.title} </h2>
					<div className={"charts"+this.props.chartId} id={this.props.chartId} onClick={this.updateChart}></div>
						<button className={"btn btn-primary"} type={"button"} id={"plain-"+this.props.chartId} onClick={this.plain}>Plain</button>
						<button className={"btn btn-primary"} type={"button"} id={"inverted-"+this.props.chartId} onClick={this.inverted}>Inverted</button>
						<button className={"btn btn-primary"} type={"button"} id={"polar-"+this.props.chartId} onClick={this.polar}>Polar</button>
			</div>

		)
	}

}
export default BarChart
