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
		this.bbox = {}
		this.myHeaders = new Headers({
			  "Authorization": "Basic " + btoa("cuser" + ":" + "JumpyMonk3y"),
			})
		this.fetchOptions = {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
			headers: this.myHeaders
		}
		this.major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
		this.cityAboveScoresCountURL = "http://115.146.94.41:5000/result_data/_design/crime_detection_major_city/_view/crime_detection_major_city?reduce=true"
	}

	returnBBboxQueryWithCityName(cityName) {
		return "https://api.mapbox.com/geocoding/v5/mapbox.places/" + cityName + ".json?access_token=pk.eyJ1IjoibGl1YmluZ2ZlbmciLCJhIjoiY2lxN3pnYTlqMDB2cGZ5bTFmbHRyODU2OSJ9.GnnMuWeQ1EQ4RAgmttR-pg"
	}

	fetchBbox(cityName) {

		if(this.bbox[cityName] != null) {
			return
		}

		fetch(this.returnBBboxQueryWithCityName(cityName)).
		then((response) => { return response.json() }).
		then((json) => {
			console.log( " bbox => "  + json["features"][0]["bbox"])
			this.bbox[cityName] = json["features"][0]["bbox"]
		})
	}

	componentDidMount() {
		// this.fetchBbox("sydney")
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


		fetch(this.cityAboveScoresCountURL, this.fetchOptions).
		then( (response) => { return response.json() } ).
		then( (json) => {
			console.log("city score count => " + json["rows"][0]["value"]["adelaide"])

			let cityAboveScoresCountResult = json["rows"][0]["value"]
			let cityNames = Object.keys(["rows"][0]["value"])
			console.log("cityAboveScoresCountResult keys => " + json["rows"][0]["value"]["adelaide"])

			for(let i = 0; i < cityAboveScoresCountResult.length; i++) {
				let tempScore = cityAboveScoresCountResult[cityNames[i]]
				tempScore = parseInt(tempScore)
				for(let j = 0; j < tempScore; j++){
					
				}
			}

		} )


		// let latlong = []
		// let latBound = 90
		// let longBound = 180
		// let minLat = -37.875343
		// let maxLat = -37.653601
		// let minLon = 144.726292
		// let maxLon = 145.184971
		// this.timerID = setInterval(
	    //   	() => {
		// 			// for bound range neg and pos
		// 			// latlong = [Math.random()*(Math.random() < 0.5 ? -1 : 1) * latBound, Math.random()*(Math.random() < 0.5 ? -1 : 1) * longBound]
		// 			//console.log("lat lon =>" + latlog)
		// 			latlong = [Math.random()*(maxLat-minLat)+minLat, Math.random()*(maxLon-minLon)+minLon, 1]
		// 			// console.log("lat lon =>" + latlong)
		// 			heat.addLatLng(latlong)},
	    //   	100
    	// )

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
