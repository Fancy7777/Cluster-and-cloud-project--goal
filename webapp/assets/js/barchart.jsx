"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import Chartist from 'chartist'

class BarChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.barDistance = 10

	}

	componentDidMount() {
		// chartData {labels: [], series [[]...]}
		this.chart = new Chartist.Bar('#' + this.props.chartId,
			this.props.chartData,
			{
				seriesBarDistance: this.barDistance
			}
		)
	}


	render() {
		return(
			<div>
					<h2> {this.props.title} </h2>
					<div className={"charts"} id={this.props.chartId}></div>
			</div>

		)
	}

}
export default BarChart
