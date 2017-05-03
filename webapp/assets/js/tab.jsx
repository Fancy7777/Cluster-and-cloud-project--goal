"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
/* Inspired from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_tabs_open */

class Tab extends React.Component {

	constructor(props) {
    	super(props)
		this.elements = {}
		// React.Children.map(this.props.children,(elem, index) => {

	}

	componentDidMount() {
		document.getElementById("defaultOpen").click()
		// this.hideAll()
		// setTimeout(this.hideAll(),5000)
	}
	hideAll() {
	    let i, tabcontent;
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }
	}

	openTab(evt, tabName, elem) {
	    let i, tabcontent, tablinks;
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }
		// console.log("tabName => " + tabName)
		// console.log("element => " + document.getElementById(tabName) )
	    document.getElementById(tabName).style.display = "block";
	    evt.currentTarget.className += " active";
		// console.log("char id " + elem.props.chartId)
		// force the charts to call update()
		document.getElementById(elem.props.chartId).click()
		// elem.updateChart()
	}

	render() {
		// console.log("children title=> " + this.props.children.title)
		return(
			<div>
				<div className={"tab-button"}>
					{
						React.Children.map(this.props.children,(elem, index) => {
							// console.log("elem updateChart => " + elem.updateChart)
							let title = elem.props.title
							if (index == 0)
							{
								return (<button key={index} className={"tablinks"} onClick={(e) => {this.openTab(e, title, elem)}} id={"defaultOpen"}>{title}</button>)
							}
							else
							{
								return (<button key={index} className={"tablinks"} onClick={(e) => {this.openTab(e, title, elem)}}>{title}</button>)
							}
						})

					}
				</div>
				{
					React.Children.map(this.props.children, (elem, index) => {
						let title = elem.props.title
						return (
								<div id={title} className={"tabcontent"} >
									<h3>{title}</h3>
									{ elem }
								</div>
						)
					})
				}
			</div>
		)
	}

}
export default Tab
