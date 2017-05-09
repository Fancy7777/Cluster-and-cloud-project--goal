"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
// import Chartist from 'chartist'
// import Highcharts from 'highcharts'


// Inspired from https://www.highcharts.com/demo/pie-basic

class LineChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
		this.updateChart = this.updateChart.bind(this)
		this.chartOption = null

	}

	exportPDF()
	{
	    Highcharts.exportCharts([this.chart], {type: 'application/pdf'})
	}

	componentDidMount() {
		// chartData {labels: [], series [[]...]}
		// this.chart = new Chartist.Line('#' + this.props.chartId, this.props.chartData)


		this.chartOption = {
		    title: {
		        text: this.props.title
		    },

		    subtitle: {
		        text: 'GOAL Team'
		    },

		    yAxis: {
		        title: {
		            text: 'Number of Employees'
		        }
		    },
		    legend: {
		        layout: 'vertical',
		        align: 'right',
		        verticalAlign: 'middle'
		    },

		    plotOptions: {
		        series: {
		            pointStart: 2010
		        }
		    },

		    series: [{
		        name: 'Installation',
		        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
		    }, {
		        name: 'Manufacturing',
		        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
		    }, {
		        name: 'Sales & Distribution',
		        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
		    }, {
		        name: 'Project Development',
		        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
		    }, {
		        name: 'Other',
		        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
		    }]

		}

		this.chart = Highcharts.chart(this.props.chartId, this.chartOption)

	}

	updateChart() {
		if (this.chart != null) {
			console.log("reflow")
			// this.chart.reflow()
			// this.chart.redraw()
			this.chart.destroy()
			this.chart = Highcharts.chart(this.props.chartId, this.chartOption)
		}

	}

	render() {
		return(
			<div>
					<div className={"charts"} id={this.props.chartId} onClick={this.updateChart}></div>
			</div>

		)
	}

}
export default LineChart
