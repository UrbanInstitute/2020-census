
function lockTables(){
	d3.select("#locker").classed("locked", true)
}
function unlockTables(){
	d3.select("#locker").classed("locked", false)	
}
function tablesAreLocked(){
	return d3.select("#locker").classed("locked")
}
function getActiveState(){
	return d3.select(".state.row.active").attr("data-state")
}
function getActiveDemographic(){
	return ( d3.select(".demographic.row.active").node() == null) ? "total" : d3.select(".demographic.row.active").attr("data-demographic")
}
function getActiveFilter(){
	return (d3.select(".customRadio.demographics").classed("active")) ? "demographic" : "state"
}
function getActiveSort(){
	var section = (getActiveFilter() == "demographic") ? "state" : "demographic"
	return d3.select("." + section + ".tableHeader.active").datum()
}
function getSortOrder(){
	var section = (getActiveFilter() == "demographic") ? "state" : "demographic"
	var sort = getActiveSort()
	if(section == "demographic"){
		return (d3.select("." +  section + "." + sort + ".active").classed("descending")) ? "descending" : "ascending";
	}else{
		return (d3.select("." +  section + "." + sort + ".active").classed("descending")) ? "ascending" : "descending";
	}
}
function setActiveDemographic(demographic, isInit, isClick){
	// if(tablesAreLocked()) return false

	expandRow("demographic", demographic, isInit)


	d3.selectAll(".menuItem.active").classed("active", false)
	d3.selectAll(".demographicMenu.active").classed("active", false)
	d3.selectAll(".menuItem.bolded").classed("bolded", false)

	if(demographic != "total" && demographic != "latinx"){
		if(demographic.search("age") != -1){
			d3.select(".menuItem." + "age").classed("bolded", true)
			d3.selectAll(".demographicMenu.age").classed("active", true)
		}else{
			d3.select(".menuItem." + "race").classed("bolded", true)
			d3.selectAll(".demographicMenu.race").classed("active", true)
		}
		
	}else{
		d3.selectAll(".demographicMenu." + demographic).classed("active", true)
	}
	d3.select(".menuItem." + demographic).classed("active", true)


	d3.selectAll(".demographic.row").classed("active", false)
	d3.select(".demographic.row." + demographic ).classed("active", true)
	if(isClick){
		d3.selectAll(".demographic.row").classed("clicked", false)
		d3.select(".demographic.row." + demographic ).classed("clicked", true)
	}

	updateStateTable(demographic)
	updateMap(demographic)
	if(IS_PHONE()){
		d3.select(".mobileMenu.demographic option[value=\"" + demographic + "\"]").property("selected", true)
		if(Object.keys($(".mobileMenu.demographic").data()).length != 0){
			$(".mobileMenu.demographic").selectmenu("refresh")
		}
	}
	
}
function setActiveState(state, isInit, isClick){
	if(tablesAreLocked()) return false

	expandRow("state", state, isInit)

	d3.selectAll(".barBg.active").classed("active", false)
	d3.select(".state.fips_" + state + " .barBg").classed("active", true)

	d3.selectAll(".state.row").classed("active", false)
	d3.select(".state.row.fips_" + state).classed("active", true)
	if(isClick){
		d3.selectAll(".state.row").classed("clicked", false)
		d3.select(".state.row.fips_" + state).classed("clicked", true)

		d3.select(".barBg.clicked").classed("clicked", false)
		d3.select(".state.fips_" + state + " .barBg").classed("clicked", true)
	}

	if(!isInit) updateDemographicTable(state)

	if(IS_PHONE()){
		d3.select(".mobileMenu.state option[value=\"" + state + "\"]").property("selected", true)
		if(Object.keys($(".mobileMenu.state").data()).length != 0){
			$(".mobileMenu.state").selectmenu("refresh")
		}
	}




}
function getStateSort(){
	return d3.select(".state.tableHeader.active").datum()

}
function getDemographicSort(){
	return d3.select(".demographic.tableHeader.active").datum()

}

function showSection(section){
	if(section == "state"){
		d3.select("#stateContainer").classed("active", true)
		d3.select("#demographicsContainer").classed("active", false)
		d3.select(".customRadio.state").classed("active", true)
		d3.select(".customRadio.demographics").classed("active", false)
		d3.select(".customRadioLabel.state").classed("active", true)
		d3.select(".customRadioLabel.demographics").classed("active", false)
	}else{
		d3.select("#stateContainer").classed("active", false)
		d3.select("#demographicsContainer").classed("active", true)
		d3.select(".customRadio.state").classed("active", false)
		d3.select(".customRadio.demographics").classed("active", true)
		d3.select(".customRadioLabel.state").classed("active", false)
		d3.select(".customRadioLabel.demographics").classed("active", true)
	}
	if(IS_PHONE()){
		if(section == "demographic"){
			d3.select(".mobileMenuRow.state").style("display","none")
			d3.select(".mobileMenuRow.demographic").style("display","block")
			d3.select("#mobileSortMenuOption").text("State")
			$(".mobileMenu.sort" ).selectmenu("refresh")
		}else{
			d3.select(".mobileMenuRow.state").style("display","block")
			d3.select(".mobileMenuRow.demographic").style("display","none")
			d3.select("#mobileSortMenuOption").text("Demographic")
			$(".mobileMenu.sort" ).selectmenu("refresh")
		}
	}

}
// function selectState(state){

// }
function getTransformY(selection){
	return +selection.attr("transform").replace("translate(0,","").replace(")","")
}

function expandRow(table, selector, isInit){
	if(IS_PHONE()){
		return false;
	}

	if(table == "state") selector = "fips_" +  selector


	// if (d3.selectAll(".transitioning").nodes().length != 0){
	// 	return false;
	// }
	// if(d3.select("." + table + "." + selector + ".row").classed("active")){
	// 	return false;
	// }


	var selection = d3.select("." + table + "." + selector + ".row")
	var prevSelection = d3.select("." +  table + ".active.row")
	var nodeY = getTransformY(selection)
	var oldY = getTransformY(prevSelection)



	var shortTable = prevSelection.classed("asian") && !IS_SMALL_DESKTOP()
	var asianBump = (shortTable) ? ROW_EXPAND : 0



	if(shortTable && selector == "asian") return false
	
	if(!shortTable){
		prevSelection.select(".rowBg")
			// .transition()
			.attr("height", ROW_HEIGHT)
	}

	selection.select(".rowBg")
		// .transition()
		.attr("height", ROW_HEIGHT + ROW_EXPAND)
	
	d3.selectAll("." + table + ".toolTip.active")
		// .transition()
		.style("opacity",0)

	if(!isInit){
		prevSelection.selectAll(".activeShow")
			// .transition()
			.style("opacity", 0)
	}

	selection.selectAll(".activeShow")
		// .transition()
		.style("opacity", 1)
	d3.selectAll("." + table + "." + selector + ".toolTip")
		// .transition()
		.style("opacity", 1)			


	d3.selectAll("." + table + ".row")
		// .transition()
		.attr("transform", function(d){
			var sY = getTransformY(d3.select(this))

			if( (sY > nodeY )){
				if(isInit){
					return "translate(0," + (sY + ROW_EXPAND) + ")"
				}else{
					if(sY <= oldY){
						
						if(selector == "asian" && !IS_SMALL_DESKTOP()) return "translate(0," + (sY ) + ")"		 
						else return "translate(0," + (sY + ROW_EXPAND ) + ")"	
					}else{
						if (shortTable) return "translate(0," + (sY + asianBump) + ")"		
						else if(selector == "asian" && !IS_SMALL_DESKTOP()) return "translate(0," + (sY - ROW_EXPAND ) + ")"	
						else return "translate(0," + (sY + asianBump ) + ")"		
					}
				}
			}else{
				if(isInit){
					return "translate(0," + (sY) + ")"
				}else{
					if(sY <= nodeY && sY > oldY){
						return "translate(0," + (sY - ROW_EXPAND + asianBump) + ")"	
					}else{
						return "translate(0," + (sY ) + ")"		
					}
				}
			}
		})
		// .on("start", function(){
		// 	d3.select(this).classed("transitioning", true)
		// })
		// .on("end", function(){

		// })


			// d3.select(this).classed("transitioning", false)
			if(!isInit){
				if(table == "state"){
					updateTableTooltips(selector, getActiveDemographic())
				}else{
					updateTableTooltips(getActiveState(), selector)
				}
			}
}

function updateMap(demographic){
	var y = getYScale()

	d3.selectAll(".bar.low")
		.transition()
		.attr("y", function(d){
			var val = d[demographic + "PercentLow"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d[demographic + "PercentLow"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
	d3.selectAll(".bar.medium")
		.transition()
		.attr("y", function(d){
			var val = d[demographic + "PercentMedium"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d[demographic + "PercentMedium"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
	d3.selectAll(".bar.high")
		.transition()
		.attr("y", function(d){
			var val = d[demographic + "PercentHigh"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d[demographic + "PercentHigh"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
}

function buildMap(data, state){
	var svg = d3.select("#stateContainer")
		.data(data)
		.append("svg")
			.attr("id", "mapContainer")
			.attr("class", "resizeRemove")
			.attr("width", GET_MAP_WIDTH() )
			.attr("height",  GET_MAP_HEIGHT() )
			.append("g")

	svg.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width", GET_MAP_WIDTH())
		.attr("height", GET_MAP_HEIGHT())
		.attr("id", "mapBg")

	var projection = d3.geoEquirectangular()
		.scale( GET_MAP_SCALE() )
		.center([-96.03542,41.69553])
		.translate(GET_MAP_TRANSLATE() );

	var geoPath = d3.geoPath()
		.projection(projection);

	var map = svg
	.selectAll(".state")
		.data(data)
		.enter()
		.append("g")
			.attr("class",function(d){
				return "state fips_" + d.fips
			})
			.attr("transform", function(d,i){
				var tmp = stateData.features.filter(function(o) { return o.properties.name == d.state} )
				return "translate(" + geoPath.centroid(tmp[0]) + ")"
			})

	map.append("rect")
		.attr("width",CHART_WIDTH()-2*CHART_MARGIN + 8)
		.attr("height",CHART_WIDTH()-2*CHART_MARGIN + 8)
		.attr("x",CHART_MARGIN - 4)
		.attr("y",CHART_MARGIN - 4)
		.attr("class", function(d){
			var active = (d.fips == +state) ? " active clicked" : ""
			return "barBg" + active
		})


	var y = getYScale();

	map.append("rect")
		.attr("class", "bar low")
		.attr("x", 5)
		.attr("y", function(d){
			var val = d["totalPercentLow"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentLow"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", BAR_WIDTH())

	map.append("rect")
		.attr("class", "bar medium")
		.attr("x", 5 + BAR_WIDTH())
		.attr("y", function(d){
			var val = d["totalPercentMedium"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentMedium"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", BAR_WIDTH())


	map.append("rect")
		.attr("class", "bar high")
		.attr("x", 5 + 2*BAR_WIDTH())
		.attr("y", function(d){
			var val = d["totalPercentHigh"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentHigh"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", BAR_WIDTH())

	map.append("line")
		.attr("class", "smallAxis")
		.attr("x1", CHART_MARGIN-4 + 2)
		.attr("x2", CHART_WIDTH() - CHART_MARGIN +2)
		.attr("y1", y(0))
		.attr("y2", y(0))

	map.append("text")
		.attr("class", "mapLabel")
		.attr("x", .5*(CHART_WIDTH()-2*CHART_MARGIN + 8))
		.attr("y", 40)
		.attr("text-anchor", "middle")
		.text(function(d){
			return d.abbr
		})

	map.on("click", function(d){
		setActiveState(d.fips, false, true)
	})
	.on("mouseover", function(d){
		setActiveState(d.fips, false, false)
	})

	svg.on("mouseleave", function(d){
		setActiveState(d3.select(".state.clicked").datum().fips, false, false)
	})

	map.append("text")
		.attr("x", CHART_WIDTH() + 5)
		.attr("y", y(.02))
		.text(PERCENT(.02))
		.attr("class", "mapAxisLabel")
		.style("display", function(d){
			return (d.fips == "99") ? "block" : "none"
		})

	map.append("text")
		.attr("x", CHART_WIDTH() + 5)
		.attr("y", y(-.07))
		.text(PERCENT(-.07))
		.attr("class", "mapAxisLabel")
		.style("display", function(d){
			return (d.fips == "99") ? "block" : "none"
		})
}


function getColumnWidth(section, colNum){
	if(section == "state"){
		var W = GET_TABLE_WIDTH()
		if(IS_SMALL_DESKTOP()){
			widths = [false, 450, 220, W - 450 - 220 -35]
		}
		else if(IS_TABLET()){
			widths = [false, 330, 170, W-330-170-40]	
		}
		else{
			widths = [false, 295, 150, 220]
		}
		return widths[colNum]
	}
}

function hoverDemographic(key){
	if(key !== "dudeOut" && key != "menuOut"){
		if(key != "total" && key != "latinx"){
			d3.selectAll(".demographicSubmenuContainer").classed("active", false)
			if(key.search("age") != -1){
				d3.selectAll(".demographicSubmenuContainer.age").classed("active", true)
			}else{
				d3.selectAll(".demographicSubmenuContainer.race").classed("active", true)
			}
		}else{
			d3.selectAll(".demographicMenu").classed("hover", false)
			d3.selectAll(".demographicSubmenuContainer").classed("active", false)
			d3.selectAll(".menuItem").classed("hover", false)

		}
		d3.selectAll(".demographicMenu." + key).classed("hover", true)
		d3.selectAll(".top.menuItem." + key).classed("hover", true)

	}else{
		if(key == "dudeOut"){
			if(d3.selectAll(".demographicSubmenuContainer.active").nodes().length == 0){
				d3.selectAll(".demographicMenu").classed("hover", false)
				d3.selectAll(".menuItem").classed("hover", false)
			}
		}else{
			d3.selectAll(".demographicMenu").classed("hover", false)
			d3.selectAll(".menuItem").classed("hover", false)
			d3.selectAll(".demographicSubmenuContainer").classed("active", false)
		}


	}
}

function buildDemographicMenu(){
	var newCategories = categories.slice()
	var catIndex = categories.findIndex(function(o){
		return o.key == "ethnicity"
	})
	newCategories[catIndex] = { "top" : categories[catIndex]["sub"][0]["label"], "key": categories[catIndex]["sub"][0]["key"] }

	var container = d3.select("#demographicsContainer")
	
	var svg = container.append("svg")
	svg.attr("width", GET_MEEPLE_WIDTH())
		.attr("class", "resizeRemove")
		.attr("id", "meepleMenu")
		.attr("height", 150)

	svg.selectAll(".head")
		.data(newCategories)
		.enter()
		.append("circle")
		.attr("cx", function(d,i){ return (BODY_RADIUS + 3) + i*(BODY_RADIUS*2 + 3 + 69) })
		.attr("cy", HEAD_RADIUS + 3)
		.attr("r", HEAD_RADIUS)
		.attr("class", function(d){
			var active = (d.key == "total") ? " active" : ""
			return "demographicMenu head " + d.key + active
		})
		.on("click", function(d){
			if(d.key == "total" || d.key == "latinx"){
				setActiveDemographic(d.key, false, true)
			}
		})
		.on("mouseover", function(d){
			hoverDemographic(d.key)
		})
		.on("mouseout", function(d){
			hoverDemographic("dudeOut")
		})


	svg.selectAll(".body")
		.data(newCategories)
		.enter()
		.append("circle")
		.attr("cx", function(d,i){ return (BODY_RADIUS + 3) + i*(BODY_RADIUS*2 + 3 + 69) })
		.attr("cy", 158)
		.attr("r", BODY_RADIUS)
		.attr("class", function(d){
			var active = (d.key == "total") ? " active" : ""
			return "demographicMenu body " + d.key + active
		})
		.on("click", function(d){
			if(d.key == "total" || d.key == "latinx"){
				setActiveDemographic(d.key, false, true)
			}
		})
		.on("mouseover", function(d){
			hoverDemographic(d.key)
		})
		.on("mouseout", function(d){
			hoverDemographic("dudeOut")
		})

	var topMenu = container.append("div")
		.attr("class", "demographicMenuContainer resizeRemove")

	topMenu.selectAll(".top.state.menuItem")
		.data(newCategories)
		.enter()
		.append("div")
		.attr("class", function(d){
			var active = (d.key == "total") ? " active" : ""
			return "top state menuItem " + d.key + active
		})
		.text(function(d){ return d.top })
		.style("width", (4+2*BODY_RADIUS) + "px")
		.on("click", function(d){
			if(d.key == "total" || d.key == "latinx"){
				setActiveDemographic(d.key, false, true)
			}
		})
		.on("mouseover", function(d){
			hoverDemographic(d.key)
		})
		.on("mouseout", function(d){
			hoverDemographic("dudeOut")
		})

	var raceMenu = topMenu.append("div")
		.attr("class", "demographicSubmenuContainer race")
		.on("mouseleave", function(d){
			hoverDemographic("menuOut")
		})

	raceMenu.selectAll(".sub.state.menuItem")
		.data(newCategories[1]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state race menuItem " + d.key
		})
		.html(function(d){ return d.label.replace(/\//g,"/<br/>") })
		.on("click", function(d){
			setActiveDemographic(d.key, false, true)
		})
		.on("mouseover", function(d){
			d3.select(this).classed("hover", true)
		})
		.on("mouseout", function(d){
			d3.select(this).classed("hover", false)
		})

	var ageMenu = topMenu.append("div")
		.attr("class", "demographicSubmenuContainer age")
		.on("mouseleave", function(d){
			hoverDemographic("menuOut")
		})


	ageMenu.selectAll(".sub.state.menuItem")
		.data(newCategories[3]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state age menuItem " + d.key
		})
		.html(function(d){ return d.label })
		.on("click", function(d){
			setActiveDemographic(d.key, false, true)
		})
		.on("mouseover", function(d){
			d3.select(this).classed("hover", true)
		})
		.on("mouseout", function(d){
			d3.select(this).classed("hover", false)
		})


}

function buildStateTableHeaders(container, sortOrder){
	var c1 = container.append("div")
		.attr("class", "resizeRemove state tableHeader tableText active alphabetical " + sortOrder)
		.style("width", getColumnWidth("state",1) + "px")
		.on("click", function(){ sortStateTable("alphabetical", true) })
		.datum("alphabetical")

	c1.append("span")
		.attr("class", "tableHeaderName")
		.text("State")

	c1.append("img")
		.attr("src", "images/sort_asc.png")

	var c2 = container.append("div")
		.attr("class", "resizeRemove state tableHeader tableText projection")
		.style("width", getColumnWidth("state",2) + "px")
		.on("click", function(){ sortStateTable("projection", true) })
		.datum("projection")

	c2.append("span")
		.attr("class", "tableHeaderName")
		.text("2020 Projection")

	c2.append("img")
		.attr("src", "images/sort.png")

	var c3 = container.append("div")
		.attr("class", "resizeRemove state tableHeader tableText miscount")
		.style("width", getColumnWidth("state",3) + "px")
		.on("click", function(){ sortStateTable("miscount", true) })
		.datum("miscount")

	c3.append("span")
		.attr("class", "tableHeaderName")
		.text("Potential miscounts")

	c3.append("img")
		.attr("src", "images/sort.png")

	c2.append("div")
		.attr("class", "tableHeaderTooltip projection")
		.html(headerTooltips["projection"])

	c3.append("div")
		.attr("class", "tableHeaderTooltip miscount")
		.html(headerTooltips["miscount"])



}
function buildDemographicsTableHeaders(container, sortOrder){


	var c1 = container.append("div")
		.attr("class", "resizeRemove demographic tableHeader tableText active alphabetical " + sortOrder)
		.style("width", getColumnWidth("state",1) + "px")
		.on("click", function(){ sortDemographicTable("alphabetical", true) })
		.datum("alphabetical")

	c1.append("span")
		.attr("class", "tableHeaderName")
		.text("Demographic")

	c1.append("img")
		.attr("src", "images/sort_asc.png")

	var c2 = container.append("div")
		.attr("class", "resizeRemove demographic tableHeader tableText projection")
		.style("width", getColumnWidth("state",2) + "px")
		.on("click", function(){ sortDemographicTable("projection", true) })
		.datum("projection")

	c2.append("span")
		.attr("class", "tableHeaderName")
		.text("2020 Projection")

	c2.append("img")
		.attr("src", "images/sort.png")

	var c3 = container.append("div")
		.attr("class", "resizeRemove demographic tableHeader tableText miscount")
		.style("width", getColumnWidth("state",3) + "px")
		.on("click", function(){ sortDemographicTable("miscount", true) })
		.datum("miscount")

	c3.append("span")
		.attr("class", "tableHeaderName")
		.text("Potential miscounts")


	c3.append("img")
		.attr("src", "images/sort.png")


	c2.append("div")
		.attr("class", "tableHeaderTooltip projection")
		.html(headerTooltips["projection"])

	c3.append("div")
		.attr("class", "tableHeaderTooltip miscount")
		.html(headerTooltips["miscount"])


}


function getXScale(){
	var chartStart, chartWidth;
	if(IS_PHONE()){
		chartStart = 15;
		chartWidth = GET_TABLE_WIDTH() - 55
	}else{
		chartStart = getColumnWidth("state", 1) + getColumnWidth("state", 2)
		chartWidth = getColumnWidth("state",3)
	}

	var x = d3.scaleLinear()
				.range([chartStart, chartStart + chartWidth])
				.domain([PERCENT_MIN, PERCENT_MAX])

	return x
}
function getYScale(){
	var y = d3.scaleLinear()
		.range([CHART_MARGIN-4, CHART_WIDTH()-CHART_MARGIN + 3])
		.domain([PERCENT_MAX, PERCENT_MIN])
	return y;
}

function buildTableTooltip(section, container, data){
	var tt = container.append("div")
		.attr("class", "resizeRemove tableTooltip " + section)
		.datum(data)

	tt.append("div")
		.html("In <span class = \"table-tt-state\"></span>, <span class = \"table-tt-demographic\"></span> could be miscounted by:")
		.attr("class", "table-tt-header")

	var risks = ["low", "medium", "high"]
	var row = tt.selectAll(".table-tt-row")
		.data(risks)
		.enter()	
		.append("div")
		.attr("class", function(d){
			return "table-tt-row " + d
		})

	row.append("span")
		.attr("class", "table-tt-risk")
		.text(function(d){
			return d.charAt(0).toUpperCase() + d.slice(1) + " risk:"
		})

	row.append("span")
		.attr("class", "table-tt-percent")
	row.append("span")
		.attr("class", "table-tt-number")
		
	tt.append("div")
		.attr("class", "table-tt-disclaimer")
		.html("* These values are the same because we rounded the projections to the nearest hundred.")





}
function updateTableTooltips(state, demographic){
	if(state.search("fips_") != -1){
		state = state.split("fips_")[1]
	}
	var data = d3.select(".tableTooltip.demographic").datum()

	var datum = data.filter(function(d){ return d.fips == state })[0]

	var demographicRow = d3.select(".demographic" + "." + demographic + ".row")

	var stateRow = d3.select(".state" + ".fips_" + state + ".row")

	var demographicY = getTransformY(demographicRow)
	var stateY = getTransformY(stateRow)

	var stateLabel = data.filter(function(d){ return d.fips == state })[0].state,
		demographicLabel = getDemographicLabel(demographic)

	if(stateLabel == "US total") stateLabel = "the US"
	if(stateLabel == "District of Columbia") stateLabel = "the District of Columbia"
	demographicLabel = demographicLabel.replace("White","white").replace("Black","black").replace("Overall", "overall")
	if(demographic.search("age") != -1) demographicLabel = "people ages " + demographicLabel
	else demographicLabel = "the " + demographicLabel + " population"

	var demographicScootch =0,
		stateScootch =0;
	if(IS_SMALL_DESKTOP()){
		if(demographic == "asian") demographicScootch = -125
		else demographicScootch = -105
	}
	
	else{
		demographicScootch = 0;
	}


	d3.selectAll(".table-tt-state").html(stateLabel)
	d3.selectAll(".table-tt-demographic").html(demographicLabel)

	d3.select(".demographic.tableTooltip")
		.transition()
		.style("top", (demographicY+ 590 + demographicScootch) + "px")
	d3.select(".state.tableTooltip")
		.transition()
		.style("top", (stateY + 236 + stateScootch) + "px")

	d3.selectAll(".table-tt-row.low .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentLow"] ))
	d3.selectAll(".table-tt-row.medium .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentMedium"] ))
	d3.selectAll(".table-tt-row.high .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentHigh"] ))


	var showDisclaimer = false;
	var lowStar = "",
		medStar = "",
		highStar = "";
	var allPops = [ POPULATION(datum[demographic + "NumberLow"]), POPULATION(datum[demographic + "NumberMedium"]), POPULATION(datum[demographic + "NumberHigh"]) ]
	if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberLow"]))){
		lowStar = "*"
		showDisclaimer = true
	}
	if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberMedium"]))){
		medStar = "*"
		showDisclaimer = true
	}
	if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberHigh"]))){
		highStar = "*"
		showDisclaimer = true
	}

	d3.selectAll(".table-tt-row.low .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberLow"] ) + " people" + lowStar + ")")
	d3.selectAll(".table-tt-row.medium .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberMedium"] ) + " people" + medStar + ")")
	d3.selectAll(".table-tt-row.high .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberHigh"] ) + " people" + highStar + ")")

	d3.selectAll(".table-tt-disclaimer").classed("show", showDisclaimer)

}

function buildDotPlot(row, demographic, section, scootch){
	var x = getXScale()
	var inactiveOpacity = (IS_PHONE()) ? 1 : 0;

	var scootchY = (typeof(scootch) == "undefined") ? 0 : scootch;

	var plotY = (IS_PHONE()) ? 100 - scootchY : ROW_HEIGHT/2,
		lowY = (IS_PHONE()) ? 145 - scootchY : 20 + ROW_HEIGHT,
		medY = (IS_PHONE()) ? 165 - scootchY : lowY,
		highY = (IS_PHONE()) ? 185 - scootchY : lowY,
		lowX = (IS_PHONE()) ? 10 : x(PERCENT_MIN) - 7,
		medX = (IS_PHONE()) ? lowX : x(PERCENT_MIN) + 70,
		highX = (IS_PHONE()) ? lowX : x(PERCENT_MIN) + 170

	row.append("line")
		.attr("class", "x axis")
		.attr("x1", x(PERCENT_MIN))
		.attr("x2", x(PERCENT_MAX))
		.attr("y1", plotY)
		.attr("y2", plotY)

	row.append("line")
		.attr("class", "y axis")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y1", plotY - 9)
		.attr("y2", plotY + 9)

	row.append("circle")
		.attr("class", "low dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", plotY)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})

	row.append("circle")
		.attr("class", "medium dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", plotY)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})

	row.append("circle")
		.attr("class", "high dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", plotY)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "High"])
		})


	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(PERCENT_MIN) - 7)
		.attr("y", 20 + plotY)
		.text(PERCENT(PERCENT_MIN))
		.style("opacity", inactiveOpacity)

	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(PERCENT_MAX) - 3)
		.attr("y", 20 + plotY)
		.text(PERCENT(PERCENT_MAX))
		.style("opacity", inactiveOpacity)

	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(0) - 3)
		.attr("y", 20 + plotY)
		.text(PERCENT(0))
		.style("opacity", inactiveOpacity)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", lowX)
		.attr("y", lowY)
		.text("Low:")
		.style("opacity", inactiveOpacity)
	row.append("line")
		.attr("class", "activeShow low dotLegendUnderline " + section)
		.attr("x1", lowX)
		.attr("y1", lowY + 4)
		.attr("x2", lowX + 25)
		.attr("y2", lowY + 4)
		.style("opacity", inactiveOpacity)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", medX)
		.attr("y", medY)
		.text("Medium:")
		.style("opacity", inactiveOpacity)
	row.append("line")
		.attr("class", "activeShow medium dotLegendUnderline " + section)
		.attr("x1", medX)
		.attr("y1", medY + 4)
		.attr("x2", medX + 47)
		.attr("y2", medY + 4)
		.style("opacity", inactiveOpacity)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", highX)
		.attr("y", highY)
		.text("High:")
		.style("opacity", inactiveOpacity)
	row.append("line")
		.attr("class", "activeShow high dotLegendUnderline " + section)
		.attr("x1", highX)
		.attr("y1", highY + 4)
		.attr("x2", highX + 28)
		.attr("y2", highY + 4)
		.style("opacity", inactiveOpacity)

	// var showDisclaimer = false;
	// var lowStar = "",
	// 	medStar = "",
	// 	highStar = "";
	// var allPops = [ POPULATION(datum[demographic + "NumberLow"]), POPULATION(datum[demographic + "NumberMedium"]), POPULATION(datum[demographic + "NumberHigh"]) ]
	// if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberLow"]))){
	// 	lowStar = "*"
	// 	showDisclaimer = true
	// }
	// if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberMedium"]))){
	// 	medStar = "*"
	// 	showDisclaimer = true
	// }
	// if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberHigh"]))){
	// 	highStar = "*"
	// 	showDisclaimer = true
	// }



	row.append("text")
		.attr("class", "activeShow dotLabel low " + section)
		.attr("x", lowX + 29 )
		.attr("y", lowY)
		.html(function(d){
			if(IS_PHONE()){
				var allPops = [ POPULATION(d[demographic + "NumberLow"]), POPULATION(d[demographic + "NumberMedium"]), POPULATION(d[demographic + "NumberHigh"]) ]				
				if(containsDuplicate(allPops, POPULATION(d[demographic + "NumberLow"]))){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
					return PERCENT_LONG(d[demographic + "Percent" + "Low"]) + " (" + POPULATION(d[demographic + "NumberLow"] ) + " people*)"
				}else{
					return PERCENT_LONG(d[demographic + "Percent" + "Low"]) + " (" + POPULATION(d[demographic + "NumberLow"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(d[demographic + "Percent" + "Low"])
			}
		})
		.style("opacity", inactiveOpacity)

	row.append("text")
		.attr("class", "activeShow dotLabel medium " + section)
		.attr("x", medX + 50)
		.attr("y", medY)
		.html(function(d){
			if(IS_PHONE()){
				var allPops = [ POPULATION(d[demographic + "NumberLow"]), POPULATION(d[demographic + "NumberMedium"]), POPULATION(d[demographic + "NumberHigh"]) ]				
				if(containsDuplicate(allPops, POPULATION(d[demographic + "NumberMedium"]))){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
					return PERCENT_LONG(d[demographic + "Percent" + "Medium"]) + " (" + POPULATION(d[demographic + "NumberMedium"] ) + " people*)"
				}else{
					return PERCENT_LONG(d[demographic + "Percent" + "Medium"]) + " (" + POPULATION(d[demographic + "NumberMedium"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(d[demographic + "Percent" + "Medium"])
			}
		})
		.style("opacity", inactiveOpacity)

	row.append("text")
		.attr("class", "activeShow dotLabel high " + section)
		.attr("x", highX + 32)
		.attr("y", highY)
		.html(function(d){
			if(IS_PHONE()){
				var allPops = [ POPULATION(d[demographic + "NumberLow"]), POPULATION(d[demographic + "NumberMedium"]), POPULATION(d[demographic + "NumberHigh"]) ]				
				if(containsDuplicate(allPops, POPULATION(d[demographic + "NumberHigh"]))){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
					return PERCENT_LONG(d[demographic + "Percent" + "High"]) + " (" + POPULATION(d[demographic + "NumberHigh"] ) + " people*)"
				}else{
					return PERCENT_LONG(d[demographic + "Percent" + "High"]) + " (" + POPULATION(d[demographic + "NumberHigh"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(d[demographic + "Percent" + "High"])
			}
		})
		.style("opacity", inactiveOpacity)
}

function getDemographic(el){
	return d3.select(el.parentNode).attr("data-demographic")
}
function getDemographicLabel(demographic){
	var demographicLabel = categories.filter(function(d){ return d.key == demographic });
	if(demographicLabel.length == 1){
		return demographicLabel[0].top
	}else{
		if(demographic.search("age") != -1){
			var ages = categories.filter(function(d){ return d.key == "age" })[0].sub
			return ages.filter(function(d){ return d.key == demographic})[0].label
		}
		else if(demographic == "latinx"){
			var races = categories.filter(function(d){ return d.key == "ethnicity" })[0].sub	
			return races.filter(function(d){ return d.key == demographic})[0].label
		}else{
			var races = categories.filter(function(d){ return d.key == "race" })[0].sub	
			return races.filter(function(d){ return d.key == demographic})[0].label
		}
		
	}


}

function updateDemographicTable(state){
	var sorting = getDemographicSort()
	var data = d3.selectAll("#demographicsContainer .row").data()
	var datum = data.filter(function(o){
		return o.fips == state
	})[0]
	var x = getXScale()

	d3.selectAll(".demographic.row .mobileCornerLabel")
		.text(datum.abbr)

	d3.selectAll(".demographic.tableText.population")
		.text(function(d){
			return POPULATION_NO_SIGN(datum[getDemographic(this) + "Pop"])
		})


	d3.selectAll(".demographic.low.dot")
		.transition()
		.attr("cx", function(d){
			return x(datum[getDemographic(this) + "Percent" + "Low"])
		})

	d3.selectAll(".demographic.medium.dot")
		.transition()
		.attr("cx", function(d){
			return x(datum[getDemographic(this) + "Percent" + "Medium"])
		})

	d3.selectAll(".demographic.high.dot")
		.transition()
		.attr("cx", function(d){
			return x(datum[getDemographic(this) + "Percent" + "High"])
		})
		.on("end", function(){
			sortDemographicTable(sorting, false)
		})


	d3.selectAll(".demographic.dotLabel.low")
		.html(function(d){
			var demographic = getDemographic(this)
			if(IS_PHONE()){
				var allPops = [ POPULATION(datum[demographic + "NumberLow"]), POPULATION(datum[demographic + "NumberMedium"]), POPULATION(datum[demographic + "NumberHigh"]) ]	
				if( containsDuplicate(allPops, POPULATION(datum[demographic + "NumberLow"])) ||
					containsDuplicate(allPops, POPULATION(datum[demographic + "NumberMedium"])) ||
					containsDuplicate(allPops, POPULATION(datum[demographic + "NumberHigh"])) 
					){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
				}else{
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", false)
				}


				if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberLow"]))){
					return PERCENT_LONG(datum[demographic + "Percent" + "Low"]) + " (" + POPULATION(datum[demographic + "NumberLow"] ) + " people*)"
				}else{
					return PERCENT_LONG(datum[demographic + "Percent" + "Low"]) + " (" + POPULATION(datum[demographic + "NumberLow"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(datum[demographic + "Percent" + "Low"])
			}
		})

	d3.selectAll(".demographic.dotLabel.medium")
		.html(function(d){
			var demographic = getDemographic(this)
			if(IS_PHONE()){
				var allPops = [ POPULATION(datum[demographic + "NumberLow"]), POPULATION(datum[demographic + "NumberMedium"]), POPULATION(datum[demographic + "NumberHigh"]) ]				
				if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberMedium"]))){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
					return PERCENT_LONG(datum[demographic + "Percent" + "Medium"]) + " (" + POPULATION(datum[demographic + "NumberMedium"] ) + " people*)"
				}else{
					return PERCENT_LONG(datum[demographic + "Percent" + "Medium"]) + " (" + POPULATION(datum[demographic + "NumberMedium"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(datum[demographic + "Percent" + "Medium"])
			}
		})

	d3.selectAll(".demographic.dotLabel.high")
		.html(function(d){
			var demographic = getDemographic(this)
			if(IS_PHONE()){
				var allPops = [ POPULATION(datum[demographic + "NumberLow"]), POPULATION(datum[demographic + "NumberMedium"]), POPULATION(datum[demographic + "NumberHigh"]) ]				
				if(containsDuplicate(allPops, POPULATION(datum[demographic + "NumberHigh"]))){
					d3.select(this.parentNode).selectAll(".mobileDisclaimer").classed("show", true)
					return PERCENT_LONG(datum[demographic + "Percent" + "High"]) + " (" + POPULATION(datum[demographic + "NumberHigh"] ) + " people*)"
				}else{
					return PERCENT_LONG(datum[demographic + "Percent" + "High"]) + " (" + POPULATION(datum[demographic + "NumberHigh"] ) + " people)"
				}
			}else{
				return PERCENT_LONG(datum[demographic + "Percent" + "High"])
			}
		})

}

function closeMobileTooltip(){
	d3.select("#mobileTooltipContainer").style("display", "none")
}
function showMobileTooltip(column){
	d3.select("#mobileTooltipText").html(headerTooltips[column])
	d3.select("#mobileTooltipContainer").style("display", "block")
}
function buildDemographicTable(data, defaultDemographic, sort, sortOrder){
	var container = d3.select("#stateContainer")
	buildDemographicsTableHeaders(container, sortOrder)
	buildTableTooltip("demographic", container, data)

	var usDatum = data.filter(function(o){
		return o.fips == getActiveState()
	})

	if(IS_PHONE()){
		var tooltipContainer = d3.select("body")
			.append("div")
			.attr("id", "mobileTooltipContainer")
			.style("display", "none")

		var tooltip = tooltipContainer.append("div")
			.attr("id", "mobileTooltip")

		tooltip.append("img")
			.attr("src", "images/close.png")
			.on("click", closeMobileTooltip)

		tooltip.append("span")
			.attr("id", "mobileTooltipText")
	}

	var svg = container.append("svg").attr("id", "demographicTable")
		.attr("class", "resizeRemove")

	var svgHeight = (IS_PHONE()) ? 11 * ROW_HEIGHT : 14 * ROW_HEIGHT + ROW_EXPAND + ROW_EXPAND

	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", svgHeight)
		.data(usDatum)

	var rowCount = 0;
	var asianBump = 0;

	var overallScootch = (IS_PHONE()) ? 16 : 0,
		categoryX = (IS_PHONE()) ? 10 : 30,
		categoryY = (IS_PHONE()) ? 36 : 6 + ROW_HEIGHT/2,
		populationX = (IS_PHONE()) ? categoryX + 93 : getColumnWidth("state", 1),
		populationY = (IS_PHONE()) ? 62 : 6 + ROW_HEIGHT/2,
		popInfoX = categoryX + 170,
		miscountInfoX = categoryX + 115,
		parentCategoryX = categoryX,
		parentCategoryY = 20,
		stateX = GET_TABLE_WIDTH() - 35,
		stateY = parentCategoryY,
		disclaimerX = categoryX,
		disclaimerY = 222,
		miscountX = categoryX,
		miscountY = 87;

	for(var i = 0; i < categories.length; i++){
		var category = categories[i]
		if(category.hasOwnProperty("sub")){
			if(IS_PHONE()){
				var rowParent = svg
					.append("g")
					.attr("class", "demographic spacer row " + category.key)
					.attr("transform", "translate(0," + (asianBump  + 4+ rowCount * ROW_HEIGHT) + ")")

			}else{
				var rowParent = svg
					.append("g")
					.attr("class", "demographic spacer row " + category.key)
					.attr("transform", "translate(0," + (asianBump  + 4+ rowCount * ROW_HEIGHT) + ")")


				rowParent.append("rect")
					.attr("class", "rowBg")
					.attr("x",-10)
					.attr("y",0)
					.attr("width", GET_TABLE_WIDTH() + 20)
					.attr("height", ROW_HEIGHT)


				rowParent.append("text")
					.attr("class", "demographic header tableText")
					.attr("x", 10)
					.attr("y", 6 + ROW_HEIGHT/2)
					.text(category.top)

				rowCount++
			}

			for(var j = 0; j < category.sub.length; j++){
				var sub = category["sub"][j]
				var subDemographic = sub.key

				var big = (subDemographic == "asian"  && !IS_SMALL_DESKTOP() && !IS_PHONE())
				var active = (subDemographic == defaultDemographic) ? " active clicked" : ""
				var rowSub = svg
					.append("g")
					.attr("class", "demographic rowSub row " + subDemographic + " " + category.key + active)
					.attr("data-demographic", subDemographic)
					.attr("transform", "translate(0," + (asianBump + 4+ rowCount * ROW_HEIGHT) + ")")

				if(big) asianBump = ROW_EXPAND

				if(IS_PHONE()){
					rowSub.append("rect")
						.attr("class", "rowBgMobileBackground")
						.attr("x",8)
						.attr("y",8)
						.attr("width", GET_TABLE_WIDTH() - 10)
						.attr("height", CARD_HEIGHT)

					rowSub.append("rect")
						.attr("class", "rowBgMobile")
						.attr("x",2)
						.attr("y",2)
						.attr("width", GET_TABLE_WIDTH() - 10)
						.attr("height", CARD_HEIGHT)

					rowSub.append("text")
						.attr("class", "demographic standard tableText parentCategory")
						.attr("x", parentCategoryX)
						.attr("y", parentCategoryY)
						.html(category.key.toUpperCase())

					rowSub.append("text")
						.attr("class", "mobileDisclaimer")
						.attr("x", disclaimerX)
						.attr("y", disclaimerY)
						.text("* These values are the same because we rounded the")
					rowSub.append("text")
						.attr("class", "mobileDisclaimer")
						.attr("x", disclaimerX + 5)
						.attr("y", disclaimerY + 12)
						.text("projections to the nearest hundred.")

					rowSub.append("text")
						.attr("class", "mobileHeader population")
						.attr("x", miscountX)
						.attr("y", populationY)
						.text("2020 Projection:")
					rowSub.append("text")
						.attr("class", "mobileHeader miscount")
						.attr("x", miscountX)
						.attr("y", miscountY)
						.text("Potential miscount:")

					rowSub.append("text")
						.attr("class", "mobileCornerLabel")
						.attr("x", stateX)
						.attr("y", stateY)
						.attr("text-anchor", "right")
						.text(function(d){
							return d.abbr
						})

					rowSub.append("circle")
						.attr("class", "mobileInfoCircle")
						.attr("cx", popInfoX)
						.attr("cy", populationY - 4)
						.attr("r", 7)
						.on("click", function(){ showMobileTooltip("projection") })
					rowSub.append("text")
						.attr("class", "mobileInfoText")
						.attr("x", popInfoX - 2)
						.attr("y", populationY )
						.text("?")

					rowSub.append("circle")
						.attr("class", "mobileInfoCircle")
						.attr("cx", miscountInfoX)
						.attr("cy", miscountY - 4)
						.attr("r", 7)
						.on("click", function(){ showMobileTooltip("miscount") })
					rowSub.append("text")
						.attr("class", "mobileInfoText")
						.attr("x", miscountInfoX - 2)
						.attr("y", miscountY )
						.text("?")

						



				}else{
					rowSub.append("rect")
						.attr("class", "rowBg")
						.attr("x",-10)
						.attr("y",0)
						.attr("width", GET_TABLE_WIDTH()+20)
						.attr("height", function(){
							if(big) return ROW_HEIGHT + ROW_EXPAND
							else return ROW_HEIGHT
						})
				}

				if(big){
					rowSub.append("text")
						.attr("class", "demographic standard tableText category")
						.attr("y", categoryY)
						.attr("x", categoryX)
						.html(sub.label.split("/P")[0] + "/")
					rowSub.append("text")
						.attr("class", "demographic standard tableText category")
						.attr("y", categoryY + 22)
						.attr("x", categoryX)
						.html("P" + sub.label.split("/P")[1] + "/")

				}else{
					rowSub.append("text")
						.attr("class", "demographic standard tableText category")
						.attr("y", categoryY)
						.attr("x", categoryX)
						.html(sub.label)
				}

				rowSub.append("text")
					.attr("class", "demographic standard tableText population")
					.attr("y", populationY)
					.attr("x", populationX)
					.text(function(d){
						return POPULATION_NO_SIGN(d[subDemographic + "Pop"])
					})


				buildDotPlot(rowSub, subDemographic, "demographic")

				if(!IS_PHONE()){
					rowSub.on("click", function(d){
						setActiveDemographic(d3.select(this).attr("data-demographic"), false, true)
					})
					.on("mouseover", function(d){
						setActiveDemographic(d3.select(this).attr("data-demographic"), false, false)	
					})
				}

				rowCount++


			}

		}else{
			var demographic = category.key
			var active = (demographic == defaultDemographic) ? " active clicked" : ""

			var row = svg
				.append("g")
				.attr("class", "demographic row " + demographic + active + " " + category.key)
				.attr("data-demographic", demographic)
				.attr("transform", "translate(0," + (overallScootch + asianBump + 4+ rowCount * ROW_HEIGHT) + ")")

				if(IS_PHONE()){
					row.append("rect")
						.attr("class", "rowBgMobileBackground")
						.attr("x",8)
						.attr("y",8)
						.attr("width", GET_TABLE_WIDTH() - 10)
						.attr("height", CARD_HEIGHT - overallScootch)

					row.append("rect")
						.attr("class", "rowBgMobile")
						.attr("x",2)
						.attr("y",2)
						.attr("width", GET_TABLE_WIDTH() - 10)
						.attr("height", CARD_HEIGHT - overallScootch)

					row.append("text")
						.attr("class", "mobileDisclaimer")
						.attr("x", disclaimerX)
						.attr("y", disclaimerY - overallScootch)
						.text("* These values are the same because we rounded the")
					row.append("text")
						.attr("class", "mobileDisclaimer")
						.attr("x", disclaimerX + 5)
						.attr("y", disclaimerY + 12 - overallScootch)
						.text("projections to the nearest hundred.")

					row.append("text")
						.attr("class", "mobileHeader population")
						.attr("x", miscountX)
						.attr("y", populationY - overallScootch)
						.text("2020 Projection:")
					row.append("text")
						.attr("class", "mobileHeader miscount")
						.attr("x", miscountX)
						.attr("y", miscountY - overallScootch)
						.text("Potential miscount:")

					row.append("text")
						.attr("class", "mobileCornerLabel")
						.attr("x", stateX)
						.attr("y", stateY )
						.attr("text-anchor", "right")
						.text(function(d){
							return d.abbr
						})

					row.append("circle")
						.attr("class", "mobileInfoCircle")
						.attr("cx", popInfoX)
						.attr("cy", populationY - 4- overallScootch)
						.attr("r", 7)
						.on("click", function(){ showMobileTooltip("projection") })
					row.append("text")
						.attr("class", "mobileInfoText")
						.attr("x", popInfoX - 2)
						.attr("y", populationY - overallScootch)
						.text("?")

					row.append("circle")
						.attr("class", "mobileInfoCircle")
						.attr("cx", miscountInfoX)
						.attr("cy", miscountY - 4- overallScootch)
						.attr("r", 7)
						.on("click", function(){ showMobileTooltip("miscount") })
					row.append("text")
						.attr("class", "mobileInfoText")
						.attr("x", miscountInfoX - 2)
						.attr("y", miscountY - overallScootch)
						.text("?")



				}else{
					row.append("rect")
						.attr("class", "rowBg")
						.attr("x",-10)
						.attr("y",0)
						.attr("width", GET_TABLE_WIDTH()+20)
						.attr("height", ROW_HEIGHT)
				}


			row.append("text")
				.attr("class", "demographic header tableText category")
				.attr("x", categoryX)
				.attr("y", categoryY - overallScootch)
				.text(category.top)

			row.append("text")
				.attr("class", "demographic standard tableText population")
				.attr("y", populationY - overallScootch)
				.attr("x", populationX)
				.text(function(d){
					return POPULATION_NO_SIGN(d[demographic + "Pop"])
				})

			buildDotPlot(row, demographic, "demographic", overallScootch)
			if(!IS_PHONE()){
				row.on("click", function(d){
					setActiveDemographic(d3.select(this).attr("data-demographic"), false, true)
				})
				.on("mouseenter", function(d){
					setActiveDemographic(d3.select(this).attr("data-demographic"), false, false)	
				})
			}

			rowCount++
		}

	}
	svg.on("mouseleave", function(d){
		setActiveDemographic(d3.select(".demographic.row.clicked").attr("data-demographic"), false, false)
	})
	setActiveDemographic(defaultDemographic, true, true)
	d3.select(".demographic.row.total").moveToFront()

	if(sort != ""){
		if(sortOrder == ""){
			sortDemographicTable(sort, false)
		}else{
			sortDemographicTable(sort, false, sortOrder)
		}
	}


}

function buildStateTable(data, state, sort, sortOrder){
	

	var container = d3.select("#demographicsContainer")
	buildStateTableHeaders(container, sortOrder);
	buildTableTooltip("state", container, data)

	var rowCount = data.length

	var svg = container.append("svg").attr("id", "stateTable")
		.attr("class", "resizeRemove")

	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", rowCount * ROW_HEIGHT + ROW_EXPAND + ROW_EXPAND)

	var row = svg.selectAll(".row")
		.data(data)
		.enter()
		.append("g")
		.attr("class", function(d){
			var active = (d.fips == +state) ? " active clicked" : "";
			return "state row fips_" + d.fips + active;
		})
		.attr("data-state", function(d){ return d.fips })
		.attr("transform", function(d,i){
			return "translate(0," + (4+ i * ROW_HEIGHT) + ")"
		})
		.on("click", function(d){
			setActiveState(d.fips, false, true)
		})
		.on("mouseover", function(d){
			setActiveState(d.fips, false, false)	
		})


	row.append("rect")
		.attr("class", "rowBg")
		.attr("x",-10)
		.attr("y",0)
		.attr("width", GET_TABLE_WIDTH()+20)
		.attr("height", ROW_HEIGHT)

	row.append("text")
		.attr("class", "state standard tableText category")
		.attr("x", 10)
		.attr("y", 6 + ROW_HEIGHT/2)
		.text(function(d){ return d.state })

	row.append("text")
		.attr("class", "state standard tableText population")
		.attr("y", 6 + ROW_HEIGHT/2)
		.attr("x", getColumnWidth("state", 1))
		.text(function(d){
			var demographic = getActiveDemographic();
			return POPULATION_NO_SIGN(d[demographic + "Pop"])
		})

	buildDotPlot(row, getActiveDemographic(), "state")

	svg.on("mouseleave", function(d){
		setActiveState(d3.select(".state.row.clicked").datum().fips, false, false)
	})

	setActiveState(state, true, true)
	d3.select(".state.row.fips_99").moveToFront()

	if(sort != ""){
		if(sortOrder == ""){
			sortStateTable(sort, false)
		}else{
			sortStateTable(sort, false, sortOrder)
		}
	}




}

function updateStateTable(demographic){
	var sorting = getStateSort()
	var x = getXScale()

	d3.selectAll(".state.tableText.population")
		.text(function(d){
			return POPULATION_NO_SIGN(d[demographic + "Pop"])
		})

	d3.selectAll(".state.low.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})

	d3.selectAll(".state.medium.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})

	d3.selectAll(".state.high.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "High"])
		})
		.on("end", function(){
			sortStateTable(sorting, false)
		})

	d3.selectAll(".state.dotLabel.low")
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "Low"])
		})


	d3.selectAll(".state.dotLabel.medium")
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "Medium"])
		})


	d3.selectAll(".state.dotLabel.high")
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "High"])
		})


}

function sortStateTable(sorting, isClick, order){
	var demographic = getActiveDemographic()
	var data = d3.selectAll(".state.row").data()

	d3.selectAll(".state.tableHeader.active").classed("active", false);
	var header = d3.select(".state.tableHeader." + sorting)
	var sortOrder;

	header.classed("active", true)



	if(typeof(order) == "undefined"){
		if(header.classed("ascending")){
			sortOrder = (isClick) ? "descending" : "ascending";
		}
		else if(header.classed("descending")){
			sortOrder = (isClick) ? "ascending" : "descending";
		}else{
			sortOrder = (isClick) ? "ascending" : "descending";
		}
	}else{
		sortOrder = (order == "ascending") ? "descending" : "ascending";
	}

	d3.selectAll(".state.tableHeader.ascending").classed("ascending", false)
	d3.selectAll(".state.tableHeader.descending").classed("descending", false)
	d3.selectAll(".state.tableHeader img").attr("src", "images/sort.png")

	if(sortOrder == "ascending"){
		header.classed("ascending", true)
		header.select("img").attr("src", "images/sort_asc.png")
	}else{
		header.classed("descending", true)
		header.select("img").attr("src", "images/sort_desc.png")
	}





	if(sorting == "miscount"){
		data.sort(function(a, b) {
		    return(sortOrder == "descending") ? a[demographic + "PercentHigh"] - b[demographic + "PercentHigh"] : b[demographic + "PercentHigh"] - a[demographic + "PercentHigh"];
		});
	}
	else if(sorting == "alphabetical"){
		data.sort(function(a, b) {
		    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
		    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

		    if(sortOrder == "descending"){
		    	return (textA < textB || textA == "US TOTAL") ? -1 : (textA > textB) ? 1 : 0;	
		    }else{
		    	return (textA > textB ) ? -1 : (textA < textB ) ? 1 : 0;	
		    }

	    	
		});
	}
	else if(sorting == "projection"){
		data.sort(function(a, b) {
		    return (sortOrder == "ascending") ? b[demographic + "Pop"] - a[demographic + "Pop"] : a[demographic + "Pop"] - b[demographic + "Pop"]
		});
	}


	var fips = data.map(function(o){ return o.fips }),
		active = d3.select(".row.state.active").datum().fips,
		activeIndex = fips.indexOf(active)
	

	for(var i = 0; i < fips.length; i++){
		var bump = (i > activeIndex) ? ROW_EXPAND : 0
		d3.select(".state.row.fips_" + fips[i])
			.attr("data-order", i)
			.transition()
			.duration(DURATION )
			.delay(i * 20)
			.attr("transform", "translate(0," + (bump + 4+ i * ROW_HEIGHT) + ")")
			.on("start", lockTables)
			.on("end", function(){
				if(d3.select(this).attr("data-order") == fips.length -1){
					unlockTables()
					updateTableTooltips(getActiveState(), getActiveDemographic())
				}
			})
	}

}


function sortDemographicTable(sorting, isClick, order){
	d3.selectAll(".demographic.tableHeader.active").classed("active", false);
	var header = d3.select(".demographic.tableHeader." + sorting)
	var sortOrder;

	header.classed("active", true)

	if(typeof(order) == "undefined"){
		if(header.classed("ascending")){
			sortOrder = (isClick) ? "descending" : "ascending";
		}
		else if(header.classed("descending")){
			sortOrder = (isClick) ? "ascending" : "descending"
		}else{
			sortOrder = (isClick) ? "ascending" : "descending"
		}
	}else{
		sortOrder = order;
	}

	d3.selectAll(".demographic.tableHeader.ascending").classed("ascending", false)
	d3.selectAll(".demographic.tableHeader.descending").classed("descending", false)
	d3.selectAll(".demographic.tableHeader img").attr("src", "images/sort.png")

	if(sortOrder == "ascending"){
		header.classed("ascending", true)
		header.select("img").attr("src", "images/sort_asc.png")
	}else{
		header.classed("descending", true)
		header.select("img").attr("src", "images/sort_desc.png")
	}



	var data = d3.selectAll("#demographicsContainer .row").data()
	var datum = data.filter(function(o){
		return o.fips == getActiveState()
	})[0]

	for(var i = 0; i < categories.length; i++){
		var category = categories[i]
		if(category.hasOwnProperty("sub")){
			var keys = category["sub"].map(function(o){ return o.key })
			var sortedKeys;
			var subData;

			if(sorting == "alphabetical"){
				sortedKeys = (sortOrder == "ascending") ? keys : keys.reverse();
			}
			else if(sorting == "projection"){
				subData = keys.map(function(k){ return {"key": k, "val": datum[k + "Pop"]} })
				subData.sort(function(a, b) {
		    		return (sortOrder == "ascending") ? b.val - a.val : a.val - b.val
				});
				sortedKeys = subData.map(function(o){ return o.key })


			}
			else if(sorting == "miscount"){
				subData = keys.map(function(k){ return {"key": k, "val": datum[k + "PercentHigh"]} })
				subData.sort(function(a, b) {
		    		return (sortOrder == "ascending") ? a.val - b.val : b.val - a.val
				});
				sortedKeys = subData.map(function(o){ return o.key })


			}

			var startY = getTransformY(d3.select(".row.spacer." + category.key)) + ROW_HEIGHT

			if(IS_PHONE()) startY -= ROW_HEIGHT

			var moveY = startY;
			

			for(var j = 0; j<sortedKeys.length; j++){
				var key = sortedKeys[j]
				var toMove = d3.select(".demographic.row." + key)

				toMove
					// .attr("data-order", function(){
					// 	return (j == sortedKeys.lengh -1 )
					// })
					.transition()
					.attr("transform", "translate(0," + (moveY) + ")")
					// .on("start", lockTables)
					.on("end", function(){
						// if(d3.select(this).attr("data-order")){
							// unlockTables()
							updateTableTooltips(getActiveState(), getActiveDemographic())
						// }
					})

				if ( toMove.classed("active") && key != "asian" && !IS_PHONE()) moveY += ROW_EXPAND
				else if(key == "asian" && !IS_PHONE()) moveY += ROW_EXPAND

				moveY += ROW_HEIGHT
			}

		}
	}

}

function bindListeners(){
	var moretextHeights = {"low": 198, "medium": 176, "high": 220}
	d3.selectAll(".readMore").on("click", function(){
		if(d3.select(this).classed("close")){
			d3.select(this)
				.classed("close", false)
				.classed("open", true)
				.select("span")
					.text("Read less")
			d3.select(this).select("img").attr("src", "images/more-arrow_open.png")

			var textHeight;
			if(d3.select(this).classed("low")) textHeight = moretextHeights.low
			else if(d3.select(this).classed("medium")) textHeight = moretextHeights.medium
			else if(d3.select(this).classed("high")) textHeight = moretextHeights.high

			d3.select(this.parentNode).select(".legendMoreText")
				.transition()
				.style("height", textHeight + "px")			
		}else{
			d3.select(this)
				.classed("open", false)
				.classed("close", true)
				.select("span")
					.text("Read more")

			d3.select(this).select("img").attr("src", "images/more-arrow.png")

			d3.select(this.parentNode).select(".legendMoreText")
				.transition()
				.style("height", "0px")	
		}
	})

	d3.selectAll(".tableHeader span")
		.on("mouseover", function(){
			d3.select(this.parentNode).select(".tableHeaderTooltip")
				.style("display", "block")
		})
		.on("mouseout", function(){
			d3.select(this.parentNode).select(".tableHeaderTooltip")
				.style("display", "none")
		})

	d3.selectAll(".customRadioRow")
		.on("click", function(){
			if(d3.select(this).classed("state")){
				showSection("state")
			}else{ showSection("demographics") }

		})

	d3.select(".customShareLink")
		.on("click", function(){
			if(d3.select(".customShareBox").classed("visible")){
				d3.select(".customShareBox").classed("visible", false)
			}else{
				d3.select(".customShareBox").classed("visible", true)
			}
			d3.select("#shareURL").attr("value", getShareURL())
		})
	d3.select("#copyUrlButton").on("click", function(){
		copyTextToClipboard(getShareURL())
		d3.select("#copyUrlNote")
			.style("opacity",1)
			.transition()
			.delay(1500)
			.duration(1000)
			.style("opacity", 0)
	})
	if(IS_PHONE()){
		$(".mobileMenu.filter" ).selectmenu({
			change: function(event, d){
				showSection(d.item.value)
			}
		})
		$(".mobileMenu.state" ).selectmenu({
			change: function(event, d){
				setActiveState(d.item.value, false, true)
			}
		})
		$(".mobileMenu.demographic" ).selectmenu({
			change: function(event, d){
				setActiveDemographic(d.item.value, false, true)
			}
		})
		$(".mobileMenu.sort" ).selectmenu({
			change: function(event, d){
				var filter = getActiveFilter(),
					sortOrder = getSortOrder()

				if(filter == "state"){
					sortDemographicTable(d.item.value, true, sortOrder)
				}else{
					sortStateTable(d.item.value, true, sortOrder)
				}
			}
		})
	}


}

function getShareURL(){
	var url = [location.protocol, '//', location.host, location.pathname].join('');
	var queryParams = []
	if(getActiveState() != "99") queryParams.push( "state=" + d3.select("g.state.fips_" + getActiveState()).datum().abbr )
	if(getActiveDemographic() != "total") queryParams.push("demographic=" + getActiveDemographic() )
	if(getActiveFilter() != "state") queryParams.push("filter=" + getActiveFilter() )
	if(getActiveSort() == "alphabetical"){
		if(getSortOrder() == "descending"){
			queryParams.push("sort=alphabetical")
			queryParams.push("sortOrder=descending")
		}
	}else{
			queryParams.push("sort=" + getActiveSort())
			queryParams.push("sortOrder=" + getSortOrder())
	}

	if (queryParams.length > 0){
		return url + "?" + queryParams.join("&")
	}else{
		return url
	}

}


function init(data, isInit){
	data.sort(function(a, b) {
	    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
	    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

	    return (textA < textB ) ? -1 : (textA > textB) ? 1 : 0;
	});



	if(isInit){
		var section = (getQueryString("filter") == "") ? "state" : getQueryString("filter"),
			stateAbbr = (getQueryString("state") == "") ? "US" : getQueryString("state"),
			demographic = (getQueryString("demographic") == "") ? "total" : getQueryString("demographic"),
			sort = getQueryString("sort"),
			sortOrder = (getQueryString("sortOrder") == "") ? "ascending" : getQueryString("sortOrder");
		
		var state = data.filter(function(o){ return o.abbr == stateAbbr })[0].fips
	}else{
		var section = getActiveFilter(),
			state = getActiveState(),
			demographic = getActiveDemographic(),
			sort = getActiveSort(),
			sortOrder = getSortOrder()

		d3.selectAll(".resizeRemove").remove()
	}


	if(! IS_PHONE()) buildDemographicMenu();
	buildStateTable(data, state, sort, sortOrder);
	if(! IS_PHONE()) buildMap(data, state)
	buildDemographicTable(data, demographic, sort, sortOrder)
	updateTableTooltips(state,demographic)
	bindListeners();
	showSection(section)
}

d3.json("data/data.json", function(data){

	init(data, true)


})


var resizeTimer;

$(window).on('resize', function(e) {

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {

	var data = d3.selectAll("#demographicsContainer .row").data()
	init(data, false)
            
  }, 250);

});
