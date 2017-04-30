"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import Chartist from 'chartist'

class LineChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null

	}

	componentDidMount() {
		// chartData {labels: [], series [[]...]}
		this.chart = new Chartist.Line('#' + this.props.chartId, this.props.chartData)
	}

	render() {
		return(
			<div>
					<h2> {this.props.chartTitle} </h2>
					<div className={"charts"} id={this.props.chartId}></div>
			</div>

		)
	}

}
export default LineChart
