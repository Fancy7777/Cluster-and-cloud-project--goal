"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import Chartist from 'chartist'

class PieChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.position = 0
		this.sum = this.props.chartData.series.reduce((a, b) => { return a + b }, 0)
		this.updateChart = this.updateChart.bind(this)
	}


	componentDidMount() {
		// chartData {labels: [], series []}

		this.options = {
			// this will get value from labels
			labelInterpolationFnc:(label) => {
					let tempSerieValue = this.props.chartData.series[this.position]
					console.log( "tempSerieValue => " + tempSerieValue + " label => " + label + " sum => " + this.sum)
					let tempLable =  label + " " + (Math.round((tempSerieValue / this.sum) * 100)) + '%'
					this.position += 1
					if (this.position >= this.props.chartData.series.length)
					{
						this.position = 0
					}
					return tempLable
				}
		}
		this.chart = new Chartist.Pie('#' + this.props.chartId,
			this.props.chartData, this.options)
		// unresigter all events
		// this.chart.update(this.props.chartData, this.options, true)
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
					<div className={"charts"} id={this.props.chartId} onClick={this.updateChart}></div>
			</div>

		)
	}

}
export default PieChart
