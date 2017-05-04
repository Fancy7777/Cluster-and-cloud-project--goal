"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import 'leaflet.heat'
import addressPoints from './realworld.10000.js'
import melbourneGeo from './melbourneGeo.js'

class HeatMapBox extends React.Component{

	constructor(props) {
    	super(props)
	}

	componentDidMount() {
		// Mel
		// let mymap = L.map(this.props.mapid).setView([50.5, 30.5], 12)
		let mymap = L.map(this.props.mapid).setView([-37.7963689,144.9589851], 10)
		L.tileLayer(this.props.mapboxAccessUrl, {
			maxZoom: 18,
		}).addTo(mymap)

		L.geoJson(melbourneGeo).addTo(mymap)

		let points = addressPoints.map((p) => { return [p[0], p[1]] })
		// console.log("points => " + points[0] );
		// console.log("L.heatLayer => " + L.heatLayer );
		let heat = L.heatLayer(points, {minOpacity: 0.1}).addTo(mymap);
		// console.log("heat => " + heat);

		let latlong = []
		let latBound = 90
		let longBound = 180
		let minLat = -37.875343
		let maxLat = -37.653601
		let minLon = 144.726292
		let maxLon = 145.184971
		this.timerID = setInterval(
	      	() => {
					// for bound range neg and pos
					// latlong = [Math.random()*(Math.random() < 0.5 ? -1 : 1) * latBound, Math.random()*(Math.random() < 0.5 ? -1 : 1) * longBound]
					//console.log("lat lon =>" + latlog)
					latlong = [Math.random()*(maxLat-minLat)+minLat, Math.random()*(maxLon-minLon)+minLon, 1]
					// console.log("lat lon =>" + latlong)
					heat.addLatLng(latlong)},
	      	100
    	)

	}

	render() {
		return(
				<div>
					<h1>Heat Map</h1>
					<div id={this.props.mapid} style={{height:"250px", width:"500px", position:"relative"}}></div>
				</div>
		)
	}
}

export default HeatMapBox
