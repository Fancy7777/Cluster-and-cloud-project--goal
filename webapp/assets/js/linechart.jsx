"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import Chartist from 'chartist'

class LineChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.updateChart = this.updateChart.bind(this)
		this.options = {}

	}

	componentDidMount() {
		// chartData {labels: [], series [[]...]}
		this.chart = new Chartist.Line('#' + this.props.chartId, this.props.chartData)

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
export default LineChart
