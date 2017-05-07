"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
// import Highcharts from 'highcharts'

// Inspired from https://www.highcharts.com/demo/pie-basic

class PieChart extends React.Component {

	constructor(props) {
    	super(props)
		this.chart = null
	}


	componentDidMount() {
		this.chart = Highcharts.chart(this.props.chartId, {
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
		    series: [{
		        name: 'Brands',
		        colorByPoint: true,
		        data: [{
		            name: 'Microsoft Internet Explorer',
		            y: 56.33
		        }, {
		            name: 'Chrome',
		            y: 24.03,
		            sliced: true,
		            selected: true
		        }, {
		            name: 'Firefox',
		            y: 10.38
		        }, {
		            name: 'Safari',
		            y: 4.77
		        }, {
		            name: 'Opera',
		            y: 0.91
		        }, {
		            name: 'Proprietary or Undetectable',
		            y: 0.2
		        }]
		    }]
		})
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
