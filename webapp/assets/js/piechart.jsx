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
	}


	componentDidMount() {
		// chartData {labels: [], series []}
		this.chart = new Chartist.Pie('#' + this.props.chartId,
			this.props.chartData,
			{
				// this will get value from labels
				labelInterpolationFnc:(label) => {
						let tempSerieValue = this.props.chartData.series[this.position]
						console.log( "tempSerieValue => " + tempSerieValue + " label => " + label + " sum => " + this.sum)
						let tempLable =  label + " " + (Math.round((tempSerieValue / this.sum) * 100)) + '%'
						this.position += 1
						return tempLable
					}
			}
		)
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
export default PieChart
