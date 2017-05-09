"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
// import Highcharts from 'highcharts'

// Inspired from https://www.highcharts.com/demo/pie-basic

class PieChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		// http://cadmin:qwerty8888@115.146.94.41:5000/tweet_raw/
		this.myHeaders = new Headers({
			  "Authorization": "Basic " + btoa("cuser" + ":" + "JumpyMonk3y"),
			});
			// btoa(username + ":" + password)
		this.mapReduceMajorCityView = "http://115.146.94.41:5000/tweet_raw_trump/_design/trump_by_major_city/_view/trump_by_major_city"
		// this.mapReduceMajorCityView = "http://115.146.94.41:5000/tweet_raw/_design/trump_by_major_city/_view/trump_by_major_city?reduce=true"
		this.fetchOptions = {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
			headers: this.myHeaders
		}

		this.updateChart = this.updateChart.bind(this)
		this.chartOption = null
	}

	fetchJsonData(url) {
		let json_data = fetch(url, this.fetchOptions)
			.then((response) => {return response.json()})
			.then((json) => {
				let majorCityData = this.processMajorCityJsonToDrawingData(json)

				this.chartOption = {
				    chart: {
				        plotBackgroundColor: null,
				        plotBorderWidth: null,
				        plotShadow: false,
				        type: 'pie'
				    },
				    title: {
				        text: this.props.title
				    },
				    tooltip: {
				        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				    },
				    plotOptions: {
				        pie: {
				            allowPointSelect: true,
				            cursor: 'pointer',
				            dataLabels: {
				                enabled: true,
				                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
				                style: {
				                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
				                }
				            }
				        }
				    },
					series: majorCityData["series"]
				}

				// chartData {labels: [], series [[]...]}
				this.chart = Highcharts.chart(this.props.chartId, this.chartOption)


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
				processedData[cityKeySet[i]] = {}

		}

		for (let i = 0; i < cityKeySet.length; i++) {
			for (let j = 0; j < sentimentTagCategories.length; j++) {
				processedData[cityKeySet[i]][sentimentTagCategories[j]] =values[cityKeySet[i]][sentimentTagCategories[j]]
			}
		}

		let dataSeries = []
		let sumSentiment = {"pos":0, "neg": 0}

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

		let dataSeriesTemp = []
		let pos_index = 0
		let pieSize = 150
		let gap = pieSize/2
		let numRow = 5
		let numDraw = 0
		for (let j = 0; j < cityKeySet.length; j++) {

			if( cityKeySet[j] == "hobart") {
				console.log("pie pass => " + cityKeySet[j])
				continue
			}

			if(pos_index >= numRow) {
				pos_index = 0
			}

			console.log(  cityKeySet[j] + ", position x => " + (gap + pieSize * pos_index) + "  posittion y => " + (gap + (pieSize * Math.floor(numDraw/numRow))))
			let temp = {
			        type: 'pie',
			        name: cityKeySet[j],
			        // data: [{
			        //     name: 'pos',
			        //     y: 13,
			        //     color: Highcharts.getOptions().colors[0] // Jane's color
			        // }, {
			        //     name: 'neg',
			        //     y: 23,
			        //     color: Highcharts.getOptions().colors[1] // John's color
			        // }],
					data: [],
			        center: [gap + pieSize * pos_index, gap + (pieSize * Math.floor(numDraw/numRow))],
			        size: pieSize,
			        showInLegend: false,
			        dataLabels: {
			            enabled: false
			        }
	    		}
			for(let i = 0; i < dataSeries.length; i++) {
				temp["data"].push({
					name: dataSeries[i]["name"],
					y: dataSeries[i]["data"][j],
					color: Highcharts.getOptions().colors[i]
				})
			}
			dataSeriesTemp.push(temp)
			numDraw += 1
			pos_index += 1
		}


		return {"series":dataSeriesTemp}
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
					<div className={"charts"} id={this.props.chartId} ></div>
					<button className={"btn btn-primary"} type={"button"} id={"button-chart-" + this.props.chartId} onClick={this.updateChart}>Refresh</button>
			</div>

		)
	}

}
export default PieChart
