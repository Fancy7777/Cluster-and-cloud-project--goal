"use strict"
import React from 'react'
import ReactDOM from 'react-dom'

class SideBar extends React.Component {

	constructor(props) {
    	super(props)

	}

	componentDidMount() {

	}

	render() {
		return(
 		   	<ul className={"sidebar-nav"}>
 			   	<li className={"sidebar-brand"}>
 				   	<a href={window.location.origin}>
 					   	GOAL Team
 				   	</a>
 			   	</li>
			   		{
				   		this.props.sideBarData.map((oneSideBarElem, index) => {
				   		return ( <li key={index}> <a key={index} href= {oneSideBarElem.href} > {oneSideBarElem.hrefName} </a> </li> )})
			   		}
 		   	</ul>

		)
	}

}
export default SideBar
