//max low -0.058338011 -> 0.021959728
//med -0.070874654 -> 0.019168451
//high -0.078255265 -> 0.017126543

//range -8% -> +3%

function getActiveSection(){

}
function getActiveState(){
	return d3.select(".state.row.active").attr("data-state")

}
function getActiveDemographic(){
	return ( d3.select(".demographic.row.active").node() == null) ? "total" : d3.select(".demographic.row.active").attr("data-demographic")
}
function setActiveDemographic(demographic, isInit, isClick){
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
	
}
function setActiveState(state, isInit, isClick){
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
	}else{
		d3.select("#stateContainer").classed("active", false)
		d3.select("#demographicsContainer").classed("active", true)
		d3.select(".customRadio.state").classed("active", false)
		d3.select(".customRadio.demographics").classed("active", true)
	}

}
// function selectState(state){

// }
function getTransformY(selection){
	return +selection.attr("transform").replace("translate(0,","").replace(")","")
}

function expandRow(table, selector, isInit){

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



	var shortTable = prevSelection.classed("asian")
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
						
						if(selector == "asian") return "translate(0," + (sY ) + ")"		 
						else return "translate(0," + (sY + ROW_EXPAND ) + ")"	
					}else{
						if (shortTable) return "translate(0," + (sY + asianBump) + ")"		
						else if(selector == "asian") return "translate(0," + (sY - ROW_EXPAND ) + ")"	
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

function buildMap(data){
	var svg = d3.select("#stateContainer")
		.data(data)
		.append("svg")
			.attr("width", 700)
			.attr("height", 450)
			.append("g")

	svg.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width", 700)
		.attr("height", 450)
		.attr("id", "mapBg")

	var projection = d3.geoEquirectangular()
		.scale(2750)
		.center([-96.03542,41.69553])
		.translate([325,176]);

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
		.attr("width",CHART_WIDTH-2*CHART_MARGIN + 8)
		.attr("height",CHART_WIDTH-2*CHART_MARGIN + 8)
		.attr("x",CHART_MARGIN - 4)
		.attr("y",CHART_MARGIN - 4)
		.attr("class", function(d){
			var active = (d.fips == 99) ? " active clicked" : ""
			return "barBg" + active
		})


	var y = getYScale();

	map.append("rect")
		.attr("class", "bar low")
		.attr("width", 2)
		.attr("x", 5)
		.attr("y", function(d){
			var val = d["totalPercentLow"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentLow"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", 14)

	map.append("rect")
		.attr("class", "bar medium")
		.attr("width", 2)
		.attr("x", 19)
		.attr("y", function(d){
			var val = d["totalPercentMedium"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentMedium"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", 14)


	map.append("rect")
		.attr("class", "bar high")
		.attr("width", 2)
		.attr("x", 33)
		.attr("y", function(d){
			var val = d["totalPercentHigh"]
			return (val > 0) ? y(val) : y(0)
		})
		.attr("height", function(d){
			var val = d["totalPercentHigh"]
			return (val > 0) ? y(0) - y(val) : y(val) - y(0)
		})
		.attr("width", 14)

	map.append("line")
		.attr("class", "smallAxis")
		.attr("x1", CHART_MARGIN-4 + 2)
		.attr("x2", CHART_WIDTH - CHART_MARGIN +2)
		.attr("y1", y(0))
		.attr("y2", y(0))

	map.append("text")
		.attr("class", "mapLabel")
		.attr("x", .5*(CHART_WIDTH-2*CHART_MARGIN + 8))
		.attr("y", 40)
		.attr("text-anchor", "middle")
		.text(function(d){
			var tmp = stateData.features.filter(function(o) { return o.properties.name == d.state} )
			return tmp[0].properties.abbr
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
		.attr("x", CHART_WIDTH + 5)
		.attr("y", y(.02))
		.text(PERCENT(.02))
		.attr("class", "mapAxisLabel")
		.style("display", function(d){
			return (d.fips == "99") ? "block" : "none"
		})

	map.append("text")
		.attr("x", CHART_WIDTH + 5)
		.attr("y", y(-.07))
		.text(PERCENT(-.07))
		.attr("class", "mapAxisLabel")
		.style("display", function(d){
			return (d.fips == "99") ? "block" : "none"
		})
}


function getColumnWidth(section, colNum){
	if(section == "state"){
		widths = [false, 295, 150, 220]
		return widths[colNum]
	}
}

function buildDemographicMenu(){
	var container = d3.select("#demographicsContainer")
	
	var svg = container.append("svg")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", 150)

	svg.selectAll(".head")
		.data(temp_categories)
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
		// .on("mouseover")


	svg.selectAll(".body")
		.data(temp_categories)
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

	var topMenu = container.append("div")
		.attr("class", "demographicMenuContainer")

	topMenu.selectAll(".top.state.menuItem")
		.data(temp_categories)
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
			d3.selectAll(".demographicSubmenuContainer").classed("active", false)
			if(d.key != "total" && d.key != "latinx"){
				if(d.key.search("age") != -1){
					d3.selectAll(".demographicSubmenuContainer.age").classed("active", true)
				}else{
					d3.selectAll(".demographicSubmenuContainer.race").classed("active", true)
				}
			}
		})

	var raceMenu = topMenu.append("div")
		.attr("class", "demographicSubmenuContainer race")

	raceMenu.selectAll(".sub.state.menuItem")
		.data(temp_categories[1]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state race menuItem " + d.key
		})
		.text(function(d){ return d.label })
		.on("click", function(d){
			setActiveDemographic(d.key, false, true)
		})

	var ageMenu = topMenu.append("div")
		.attr("class", "demographicSubmenuContainer age")


	ageMenu.selectAll(".sub.state.menuItem")
		.data(temp_categories[3]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state age menuItem " + d.key
		})
		.html(function(d){ return d.label })
		.on("click", function(d){
			setActiveDemographic(d.key, false, true)
		})


}

function buildStateTableHeaders(container){
	var c1 = container.append("div")
		.attr("class", "state tableHeader tableText active alphabetical ascending")
		.style("width", getColumnWidth("state",1) + "px")
		.on("click", function(){ sortStateTable("alphabetical", true) })
		.datum("alphabetical")

	c1.append("span")
		.attr("class", "tableHeaderName")
		.text("State")

	c1.append("img")
		.attr("src", "images/sort_asc.png")

	var c2 = container.append("div")
		.attr("class", "state tableHeader tableText projection")
		.style("width", getColumnWidth("state",2) + "px")
		.on("click", function(){ sortStateTable("projection", true) })
		.datum("projection")

	c2.append("span")
		.attr("class", "tableHeaderName")
		.text("2020 Projection")

	c2.append("img")
		.attr("src", "images/sort.png")

	var c3 = container.append("div")
		.attr("class", "state tableHeader tableText miscount")
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
function buildDemographicsTableHeaders(container){


	var c1 = container.append("div")
		.attr("class", "demographic tableHeader tableText active alphabetical ascending")
		.style("width", getColumnWidth("state",1) + "px")
		.on("click", function(){ sortDemographicTable("alphabetical", true) })
		.datum("alphabetical")

	c1.append("span")
		.attr("class", "tableHeaderName")
		.text("Demographic")

	c1.append("img")
		.attr("src", "images/sort_asc.png")

	var c2 = container.append("div")
		.attr("class", "demographic tableHeader tableText projection")
		.style("width", getColumnWidth("state",2) + "px")
		.on("click", function(){ sortDemographicTable("projection", true) })
		.datum("projection")

	c2.append("span")
		.attr("class", "tableHeaderName")
		.text("2020 Projection")

	c2.append("img")
		.attr("src", "images/sort.png")

	var c3 = container.append("div")
		.attr("class", "demographic tableHeader tableText miscount")
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
	var chartStart = getColumnWidth("state", 1) + getColumnWidth("state", 2)
	var chartWidth = getColumnWidth("state",3)

	var x = d3.scaleLinear()
				.range([chartStart, chartStart + chartWidth])
				.domain([PERCENT_MIN, PERCENT_MAX])

	return x
}
function getYScale(){
	var y = d3.scaleLinear()
		.range([CHART_MARGIN-4, CHART_WIDTH-CHART_MARGIN + 3])
		.domain([PERCENT_MAX, PERCENT_MIN])
	return y;
}

function buildTableTooltip(section, container, data){
	console.log(data)
	var tt = container.append("div")
		.attr("class", "tableTooltip " + section)
		.datum(data)

	tt.append("div")
		.html("In <span class = \"table-tt-state\"></span>, the <span class = \"table-tt-demographic\"></span> population could be miscounted by:")
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
		





}
function updateTableTooltips(state, demographic){
	if(state.search("fips_") != -1){
		state = state.split("fips_")[1]
	}
	var data = d3.select(".tableTooltip.demographic").datum()

	var datum = data.filter(function(d){ return d.fips == state })[0]

	var demographicRow = d3.select(".demographic" + "." + demographic + ".row")

	var stateRow = d3.select(".state" + ".fips_" + state + ".row")
// console.log(state, demographic)
	var demographicY = getTransformY(demographicRow)
	var stateY = getTransformY(stateRow)

	var stateLabel = data.filter(function(d){ return d.fips == state })[0].state,
		demographicLabel = getDemographicLabel(demographic)

	d3.selectAll(".table-tt-state").html(stateLabel)
	d3.selectAll(".table-tt-demographic").html(demographicLabel)

	d3.select(".demographic.tableTooltip")
		.transition()
		.style("top", (demographicY+ 590) + "px")

	d3.select(".state.tableTooltip")
		.transition()
		.style("top", (stateY+ 310) + "px")

	d3.selectAll(".table-tt-row.low .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentLow"] ))
	d3.selectAll(".table-tt-row.medium .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentMedium"] ))
	d3.selectAll(".table-tt-row.high .table-tt-percent").text(PERCENT_LONG(datum[demographic + "PercentHigh"] ))

	d3.selectAll(".table-tt-row.low .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberLow"] ) + " people)")
	d3.selectAll(".table-tt-row.medium .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberMedium"] ) + " people)")
	d3.selectAll(".table-tt-row.high .table-tt-number").html(" (" + POPULATION(datum[demographic + "NumberHigh"] ) + " people)")

}

function buildDotPlot(row, demographic, section){
	var x = getXScale()

	row.append("line")
		.attr("class", "x axis")
		.attr("x1", x(PERCENT_MIN))
		.attr("x2", x(PERCENT_MAX))
		.attr("y1", ROW_HEIGHT/2)
		.attr("y2", ROW_HEIGHT/2)

	row.append("line")
		.attr("class", "y axis")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y1", ROW_HEIGHT/2 - 9)
		.attr("y2", ROW_HEIGHT/2 + 9)

	row.append("circle")
		.attr("class", "low dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", ROW_HEIGHT/2)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})

	row.append("circle")
		.attr("class", "medium dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", ROW_HEIGHT/2)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})

	row.append("circle")
		.attr("class", "high dot " + section)
		.attr("r", DOT_RADIUS)
		.attr("cy", ROW_HEIGHT/2)
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "High"])
		})


	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(PERCENT_MIN) - 7)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(PERCENT_MIN))
		.style("opacity", 0)

	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(PERCENT_MAX) - 3)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(PERCENT_MAX))
		.style("opacity", 0)

	row.append("text")
		.attr("class", "activeShow axisLabel")
		.attr("x", x(0) - 3)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(0))
		.style("opacity", 0)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", x(PERCENT_MIN) - 7)
		.attr("y", 20 + ROW_HEIGHT)
		.text("Low:")
		.style("opacity", 0)
	row.append("line")
		.attr("class", "activeShow low dotLegendUnderline " + section)
		.attr("x1", x(PERCENT_MIN) - 7)
		.attr("y1", 20 + ROW_HEIGHT + 4)
		.attr("x2", x(PERCENT_MIN) + 18)
		.attr("y2", 20 + ROW_HEIGHT + 4)
		.style("opacity", 0)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", x(PERCENT_MIN) + 70)
		.attr("y", 20 + ROW_HEIGHT)
		.text("Medium:")
		.style("opacity", 0)
	row.append("line")
		.attr("class", "activeShow medium dotLegendUnderline " + section)
		.attr("x1", x(PERCENT_MIN) + 70)
		.attr("y1", 20 + ROW_HEIGHT + 4)
		.attr("x2", x(PERCENT_MIN) + 117)
		.attr("y2", 20 + ROW_HEIGHT + 4)
		.style("opacity", 0)


	row.append("text")
		.attr("class", "activeShow dotLegendText " + section)
		.attr("x", x(PERCENT_MIN) + 170)
		.attr("y", 20 + ROW_HEIGHT)
		.text("High:")
		.style("opacity", 0)
	row.append("line")
		.attr("class", "activeShow high dotLegendUnderline " + section)
		.attr("x1", x(PERCENT_MIN) + 170)
		.attr("y1", 20 + ROW_HEIGHT + 4)
		.attr("x2", x(PERCENT_MIN) + 198)
		.attr("y2", 20 + ROW_HEIGHT + 4)
		.style("opacity", 0)


	row.append("text")
		.attr("class", "activeShow dotLabel low " + section)
		.attr("x", x(PERCENT_MIN) + 22)
		.attr("y", 20 + ROW_HEIGHT)
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "Low"])
		})
		.style("opacity", 0)

	row.append("text")
		.attr("class", "activeShow dotLabel medium " + section)
		.attr("x", x(PERCENT_MIN) + 120)
		.attr("y", 20 + ROW_HEIGHT)
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "Medium"])
		})
		.style("opacity", 0)

	row.append("text")
		.attr("class", "activeShow dotLabel high " + section)
		.attr("x", x(PERCENT_MIN) + 202)
		.attr("y", 20 + ROW_HEIGHT)
		.text(function(d){
			return PERCENT_LONG(d[demographic + "Percent" + "High"])
		})
		.style("opacity", 0)
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


	d3.selectAll(".demographic.tableText.population")
		.text(function(d){
			return POPULATION(datum[getDemographic(this) + "Pop"])
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
		.text(function(d){
			return PERCENT_LONG(d[getDemographic(this) + "Percent" + "Low"])
		})

	d3.selectAll(".demographic.dotLabel.medium")
		.text(function(d){
			return PERCENT_LONG(datum[getDemographic(this) + "Percent" + "Medium"])
		})

	d3.selectAll(".demographic.dotLabel.high")
		.text(function(d){
			return PERCENT_LONG(datum[getDemographic(this) + "Percent" + "High"])
		})

}

function buildDemographicTable(data, defaultDemographic){
	var container = d3.select("#stateContainer")
	buildDemographicsTableHeaders(container)
	buildTableTooltip("demographic", container, data)

	var usDatum = data.filter(function(o){
		return o.fips == "99"
	})

	var svg = container.append("svg").attr("id", "demographicTable")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", 14 * ROW_HEIGHT + ROW_EXPAND + ROW_EXPAND)
		.data(usDatum)

	var rowCount = 0;
	var asianBump = 0;

	for(var i = 0; i < categories.length; i++){
		var category = categories[i]
		if(category.hasOwnProperty("sub")){
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

			for(var j = 0; j < category.sub.length; j++){
				var sub = category["sub"][j]
				var subDemographic = sub.key

				var big = (subDemographic == "asian")
				var active = (subDemographic == defaultDemographic) ? " active" : ""
				var rowSub = svg
					.append("g")
					.attr("class", "demographic rowSub row " + subDemographic + " " + category.key + active)
					.attr("data-demographic", subDemographic)
					.attr("transform", "translate(0," + (asianBump + 4+ rowCount * ROW_HEIGHT) + ")")

				if(big) asianBump = ROW_EXPAND


				rowSub.append("rect")
					.attr("class", "rowBg")
					.attr("x",-10)
					.attr("y",0)
					.attr("width", GET_TABLE_WIDTH()+20)
					.attr("height", function(){
						if(big) return ROW_HEIGHT + ROW_EXPAND
						else return ROW_HEIGHT
					})

				if(big){
					rowSub.append("text")
						.attr("class", "demographic standard tableText")
						.attr("y", 6 + ROW_HEIGHT/2)
						.attr("x", 30)
						.html(sub.label.split("/P")[0] + "/")
					rowSub.append("text")
						.attr("class", "demographic standard tableText")
						.attr("y", 28 + ROW_HEIGHT/2)
						.attr("x", 30)
						.html("P" + sub.label.split("/P")[1] + "/")

				}else{
					rowSub.append("text")
						.attr("class", "demographic standard tableText")
						.attr("y", 6 + ROW_HEIGHT/2)
						.attr("x", 30)
						.html(sub.label)
				}

				rowSub.append("text")
					.attr("class", "demographic standard tableText population")
					.attr("y", 6 + ROW_HEIGHT/2)
					.attr("x", getColumnWidth("state", 1))
					.text(function(d){
						return POPULATION(d[subDemographic + "Pop"])
					})

				buildDotPlot(rowSub, subDemographic, "demographic")

				rowSub.on("click", function(d){
					setActiveDemographic(d3.select(this).attr("data-demographic"), false, true)
				})
				.on("mouseover", function(d){
					setActiveDemographic(d3.select(this).attr("data-demographic"), false, false)	
				})


				rowCount++


			}

		}else{
			var demographic = category.key
			var active = (demographic == defaultDemographic) ? " active" : ""
			var row = svg
				.append("g")
				.attr("class", "demographic row " + demographic + active + " " + category.key)
				.attr("data-demographic", demographic)
				.attr("transform", "translate(0," + (asianBump + 4+ rowCount * ROW_HEIGHT) + ")")


			row.append("rect")
				.attr("class", "rowBg")
				.attr("x",-10)
				.attr("y",0)
				.attr("width", GET_TABLE_WIDTH()+20)
				.attr("height", ROW_HEIGHT)





			row.append("text")
				.attr("class", "demographic header tableText")
				.attr("x", 10)
				.attr("y", 6 + ROW_HEIGHT/2)
				.text(category.top)

			row.append("text")
				.attr("class", "demographic standard tableText population")
				.attr("y", 6 + ROW_HEIGHT/2)
				.attr("x", getColumnWidth("state", 1))
				.text(function(d){
					return POPULATION(d[demographic + "Pop"])
				})

			buildDotPlot(row, demographic, "demographic")
			row.on("click", function(d){
				setActiveDemographic(d3.select(this).attr("data-demographic"), false, true)
			})
			.on("mouseenter", function(d){
				setActiveDemographic(d3.select(this).attr("data-demographic"), false, false)	
			})

			rowCount++
		}

	}
	svg.on("mouseleave", function(d){
		console.log("DANCE")
		setActiveDemographic(d3.select(".demographic.row.clicked").attr("data-demographic"), false, false)
	})
	console.log("default", defaultDemographic)
	setActiveDemographic(defaultDemographic, true, true)
	d3.select(".demographic.row.total").moveToFront()


}

function buildStateTable(data, state){
	

	var container = d3.select("#demographicsContainer")
	buildStateTableHeaders(container);
	buildTableTooltip("state", container, data)

	var rowCount = data.length

	var svg = container.append("svg").attr("id", "stateTable")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", rowCount * ROW_HEIGHT + ROW_EXPAND + ROW_EXPAND)

	var row = svg.selectAll(".row")
		.data(data)
		.enter()
		.append("g")
		.attr("class", function(d){
			var active = (d.fips == +state) ? " active" : "";
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
		.attr("class", "state standard tableText")
		.attr("x", 10)
		.attr("y", 6 + ROW_HEIGHT/2)
		.text(function(d){ return d.state })

	row.append("text")
		.attr("class", "state standard tableText population")
		.attr("y", 6 + ROW_HEIGHT/2)
		.attr("x", getColumnWidth("state", 1))
		.text(function(d){
			var demographic = getActiveDemographic();
			return POPULATION(d[demographic + "Pop"])
		})

	buildDotPlot(row, getActiveDemographic(), "state")

	svg.on("mouseleave", function(d){
		setActiveState(d3.select(".state.row.clicked").datum().fips, false, false)
	})

	setActiveState(state, true, true)
	d3.select(".state.row.fips_99").moveToFront()






}

function updateStateTable(demographic){
	var sorting = getStateSort()
	var x = getXScale()

	d3.selectAll(".state.tableText.population")
		.text(function(d){
			return POPULATION(d[demographic + "Pop"])
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

function sortStateTable(sorting, isClick){
	var demographic = getActiveDemographic()
	var data = d3.selectAll(".state.row").data()

	d3.selectAll(".state.tableHeader.active").classed("active", false);
	var header = d3.select(".state.tableHeader." + sorting)
	var sortOrder;

	header.classed("active", true)

	if(header.classed("ascending")){
		sortOrder = (isClick) ? "descending" : "ascending";
	}
	else if(header.classed("descending")){
		sortOrder = (isClick) ? "ascending" : "descending";
	}else{
		sortOrder = (isClick) ? "ascending" : "descending";
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
		    return(sortOrder == "ascending") ? a[demographic + "PercentHigh"] - b[demographic + "PercentHigh"] : b[demographic + "PercentHigh"] - a[demographic + "PercentHigh"];
		});
	}
	else if(sorting == "alphabetical"){
		data.sort(function(a, b) {
		    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
		    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

		    if(sortOrder == "ascending"){
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
			.transition()
			.duration(DURATION)
			.delay(i * 20)
			.attr("transform", "translate(0," + (bump + 4+ i * ROW_HEIGHT) + ")")
			.on("end", function(){
				updateTableTooltips(getActiveState(), getActiveDemographic())
			})
	}

}


function sortDemographicTable(sorting, isClick){
	d3.selectAll(".demographic.tableHeader.active").classed("active", false);
	var header = d3.select(".demographic.tableHeader." + sorting)
	var sortOrder;

	header.classed("active", true)

	if(header.classed("ascending")){
		sortOrder = (isClick) ? "descending" : "ascending";
	}
	else if(header.classed("descending")){
		sortOrder = (isClick) ? "ascending" : "descending"
	}else{
		sortOrder = (isClick) ? "ascending" : "descending"
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
			var moveY = startY;
			for(var j = 0; j<sortedKeys.length; j++){
				var key = sortedKeys[j]
				var toMove = d3.select(".demographic.row." + key)

				toMove.transition()
					.attr("transform", "translate(0," + (moveY) + ")")
					.on("end", function(){
						updateTableTooltips(getActiveState(), getActiveDemographic())
					})

				if ( toMove.classed("active") && key != "asian") moveY += ROW_EXPAND
				else if(key == "asian") moveY += ROW_EXPAND

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

}




d3.json("data/data.json", function(data){
	data.sort(function(a, b) {
	    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
	    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

	    return (textA < textB ) ? -1 : (textA > textB) ? 1 : 0;
	});

	var section = (getQueryString("section") == "") ? "state" : getQueryString("section"),
		state = (getQueryString("state") == "") ? "99" : getQueryString("state"),
		demographic = (getQueryString("demographic") == "") ? "total" : getQueryString("demographic");

	buildDemographicMenu();
	buildStateTable(data, state);
	buildMap(data)
	buildDemographicTable(data, demographic)
	updateTableTooltips(state,demographic)
	bindListeners();
	showSection(section)



})



