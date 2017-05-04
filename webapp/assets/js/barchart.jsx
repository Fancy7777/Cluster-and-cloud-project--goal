"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import Chartist from 'chartist'

class BarChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.barDistance = 10
		this.updateChart = this.updateChart.bind(this)
		this.options = {}
	}

	componentDidMount() {
		// chartData {labels: [], series [[]...]}
		this.options = {
			seriesBarDistance: this.barDistance
		}
		this.chart = new Chartist.Bar('#' + this.props.chartId,
			this.props.chartData, this.options

		)
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
export default BarChart
