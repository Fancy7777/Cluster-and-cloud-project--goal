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
		this.options = {}
		this.plain = this.plain.bind(this)
		this.inverted = this.inverted.bind(this)
		this.polar = this.polar.bind(this)
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
		// chartData {labels: [], series [[]...]}
		this.chart = Highcharts.chart(this.props.chartId, {
		    title: {
		        text: 'Chart.update'
		    },

		    subtitle: {
		        text: 'Plain'
		    },

		    xAxis: {
		        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		    },

		    series: [{
		        type: 'column',
		        colorByPoint: true,
		        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
		        showInLegend: false
		    }]

		})
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
