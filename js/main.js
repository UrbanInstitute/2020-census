//max low -0.058338011 -> 0.021959728
//med -0.070874654 -> 0.019168451
//high -0.078255265 -> 0.017126543

//range -8% -> +3%

function getActiveSection(){

}
function getActiveState(){

}
function getActiveDemographic(){
	var activeData = d3.selectAll(".state.menuItem.active").data()
	if (activeData.length == 1){
		return activeData[0].key
	}else{
		for(var i = 0; i < activeData.length; i++){
			console.log('foo')
		}
	}

}
function setActiveDemographic(demographic){
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

	updateStateTable(demographic)
	updateMap(demographic)
}
function setActiveState(state){
	d3.selectAll(".barBg.active").classed("active", false)
	d3.select(".state.fips_" + state + " .barBg").classed("active", true)
	updateDemographicTable(state)




}
function getStateSort(){
	return d3.select(".state.tableHeader.active").datum()

}
function getDemographicSort(){

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
	var svg = d3.select("#demographicsContainer")
		.data(data)
		.append("svg")
			.attr("width", 700)
			.attr("height", 450)
			.append("g")

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
			var active = (d.fips == 99) ? " active" : ""
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
		setActiveState(d.fips)
	})
}


function getColumnWith(section, colNum){
	if(section == "state"){
		widths = [false, 200, 210, 210]
		return widths[colNum]
	}
}

function buildDemographicMenu(){
	var container = d3.select("#stateContainer")
	
	var svg = container.append("svg")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", 150)

	svg.selectAll(".head")
		.data(categories)
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
				setActiveDemographic(d.key)
			}
		})


	svg.selectAll(".body")
		.data(categories)
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
				setActiveDemographic(d.key)
			}
		})

	var topMenu = container.append("div")
		.attr("class", "demographicMenuContainer")

	topMenu.selectAll(".top.state.menuItem")
		.data(categories)
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
				setActiveDemographic(d.key)
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
		.data(categories[1]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state race menuItem " + d.key
		})
		.text(function(d){ return d.label })
		.on("click", function(d){
			setActiveDemographic(d.key)
		})

	var ageMenu = topMenu.append("div")
		.attr("class", "demographicSubmenuContainer age")


	ageMenu.selectAll(".sub.state.menuItem")
		.data(categories[3]["sub"])
		.enter()
		.append("div")
		.attr("class", function(d){
			return "sub state age menuItem " + d.key
		})
		.html(function(d){ return d.label })
		.on("click", function(d){
			setActiveDemographic(d.key)
		})


}

function buildStateTableHeaders(container){
	container.append("div")
		.text("State")
		.attr("class", "state tableHeader tableText active alphabetical")
		.style("width", getColumnWith("state",1) + "px")
		.on("click", function(){ sortStateTable("alphabetical") })
		.datum("alphabetical")

	container.append("div")
		.text("2020 Projection ")
		.attr("class", "state tableHeader tableText projection")
		.style("width", getColumnWith("state",2) + "px")
		.on("click", function(){ sortStateTable("projection") })
		.datum("projection")

	container.append("div")
		.text("Potential miscount")
		.attr("class", "state tableHeader tableText miscount")
		.style("width", getColumnWith("state",3) + "px")
		.on("click", function(){ sortStateTable("miscount") })
		.datum("miscount")

}

function getXScale(){
	var chartStart = getColumnWith("state", 1) + getColumnWith("state", 2)
	var chartWidth = getColumnWith("state",3)

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
			console.log(section, d)
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
		.attr("class", "axisLabel")
		.attr("x", x(PERCENT_MIN) - 7)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(PERCENT_MIN))

	row.append("text")
		.attr("class", "axisLabel")
		.attr("x", x(PERCENT_MAX) - 3)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(PERCENT_MAX))

	row.append("text")
		.attr("class", "axisLabel")
		.attr("x", x(0) - 3)
		.attr("y", 20 + ROW_HEIGHT/2)
		.text(PERCENT(0))


	row.append("text")
		.attr("class", "dotLabel low " + section)
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})
		.attr("y", -10 + ROW_HEIGHT/2)
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "Low"])
		})
		.attr("text-anchor","middle")

	row.append("text")
		.attr("class", "dotLabel medium " + section)
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})
		.attr("y", -10 + ROW_HEIGHT/2)
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "Medium"])
		})
		.attr("text-anchor","middle")

	row.append("text")
		.attr("class", "dotLabel high " + section)
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "High"])
		})
		.attr("y", -10 + ROW_HEIGHT/2)
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "High"])
		})
		.attr("text-anchor","middle")
}

function getDemographic(dot){
	return d3.select(dot.parentNode).attr("data-demographic")
}

function updateDemographicTable(state){
	var data = d3.selectAll("#stateContainer .row").data()
	var datum = data.filter(function(o){
		return o.fips == state
	})[0]
	// console.log(datum, state)
	var x = getXScale()



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

	d3.selectAll(".demographic.dotLabel.low")
		.text(function(d){
			return PERCENT(d[getDemographic(this) + "Percent" + "Low"])
		})
		.transition()
		.attr("x", function(d){
			return x(datum[getDemographic(this) + "Percent" + "Low"])
		})

	d3.selectAll(".demographic.dotLabel.medium")
		.text(function(d){
			return PERCENT(datum[getDemographic(this) + "Percent" + "Medium"])
		})
		.transition()
		.attr("x", function(d){
			return x(datum[getDemographic(this) + "Percent" + "Medium"])
		})

	d3.selectAll(".demographic.dotLabel.high")
		.text(function(d){
			return PERCENT(datum[getDemographic(this) + "Percent" + "High"])
		})
		.transition()
		.attr("x", function(d){
			return x(datum[getDemographic(this) + "Percent" + "High"])
		})

}

function buildDemographicTable(data){
	var container = d3.select("#demographicsContainer")
	var usDatum = data.filter(function(o){
		return o.fips == "99"
	})

	var svg = container.append("svg").attr("id", "demographicTable")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", 14 * ROW_HEIGHT)
		.data(usDatum)

	var rowCount = 0;
	for(var i = 0; i < categories.length; i++){
		var category = categories[i]
		if(category.hasOwnProperty("sub")){
			var rowParent = svg
				.append("g")
				.attr("class", "demographic spacer row " + demographic)
				.attr("transform", "translate(0," + (1+ rowCount * ROW_HEIGHT) + ")")

			rowParent.append("line")
				.attr("class","rowDivider")
				.attr("x1",0)
				.attr("x2", GET_TABLE_WIDTH())
				.attr("y1",0)
				.attr("y2",0)

			rowParent.append("rect")
				.attr("class", "rowBg")
				.attr("x",0)
				.attr("y",0)
				.attr("width", GET_TABLE_WIDTH())
				.attr("height", ROW_HEIGHT-2)

			rowParent.append("text")
				.attr("class", "demographic header tableText")
				.attr("y", 6 + ROW_HEIGHT/2)
				.text(category.top)

			rowCount++

			for(var j = 0; j < category.sub.length; j++){
				var sub = category["sub"][j]
				var subDemographic = sub.key

				var rowSub = svg
					.append("g")
					.attr("class", "demographic row " + subDemographic)
					.attr("data-demographic", subDemographic)
					.attr("transform", "translate(0," + (1+ rowCount * ROW_HEIGHT) + ")")

				rowSub.append("line")
					.attr("class","rowDivider")
					.attr("x1",0)
					.attr("x2", GET_TABLE_WIDTH())
					.attr("y1",0)
					.attr("y2",0)

				rowSub.append("rect")
					.attr("class", "rowBg")
					.attr("x",0)
					.attr("y",0)
					.attr("width", GET_TABLE_WIDTH())
					.attr("height", ROW_HEIGHT-2)

				rowSub.append("text")
					.attr("class", "demographic standard tableText")
					.attr("y", 6 + ROW_HEIGHT/2)
					.attr("x", 20)
					.html(sub.label)

				rowSub.append("text")
					.attr("class", "demographic standard tableText")
					.attr("y", 6 + ROW_HEIGHT/2)
					.attr("x", getColumnWith("state", 1))
					.text(function(d){
						return POPULATION(d[subDemographic + "Pop"])
					})

				buildDotPlot(rowSub, subDemographic, "demographic")

				rowSub.on("click", function(d){
					setActiveDemographic(d3.select(this).attr("data-demographic"))
				})

				rowCount++


			}

		}else{
			var demographic = category.key
			var active = (demographic == "total") ? " active" : ""
			var row = svg
				.append("g")
				.attr("class", "demographic row " + demographic + active)
				.attr("data-demographic", demographic)
				.attr("transform", "translate(0," + (1+ rowCount * ROW_HEIGHT) + ")")

			row.append("line")
				.attr("class","rowDivider")
				.attr("x1",0)
				.attr("x2", GET_TABLE_WIDTH())
				.attr("y1",0)
				.attr("y2",0)

			row.append("rect")
				.attr("class", "rowBg")
				.attr("x",0)
				.attr("y",0)
				.attr("width", GET_TABLE_WIDTH())
				.attr("height", ROW_HEIGHT-2)

			row.append("text")
				.attr("class", "demographic header tableText")
				.attr("y", 6 + ROW_HEIGHT/2)
				.text(category.top)

			row.append("text")
				.attr("class", "demographic standard tableText")
				.attr("y", 6 + ROW_HEIGHT/2)
				.attr("x", getColumnWith("state", 1))
				.text(function(d){
					return POPULATION(d[demographic + "Pop"])
				})

			buildDotPlot(row, demographic, "demographic")
			row.on("click", function(d){
				setActiveDemographic(d3.select(this).attr("data-demographic"))
			})
			rowCount++
		}

	}


}

function buildStateTable(data){
	

	var container = d3.select("#stateContainer")
	buildStateTableHeaders(container);

	var rowCount = data.length

	var svg = container.append("svg")
	svg.attr("width", GET_TABLE_WIDTH())
		.attr("height", rowCount * ROW_HEIGHT)

	var row = svg.selectAll(".row")
		.data(data)
		.enter()
		.append("g")
		.attr("class", function(d){
			var active = (d.fips == 99) ? " active" : "";
			return "state row fips_" + d.fips + active;
		})
		.attr("transform", function(d,i){
			return "translate(0," + (1+ i * ROW_HEIGHT) + ")"
		})

	row.append("line")
		.attr("class","rowDivider")
		.attr("x1",0)
		.attr("x2", GET_TABLE_WIDTH())
		.attr("y1",0)
		.attr("y2",0)

	row.append("rect")
		.attr("class", "rowBg")
		.attr("x",0)
		.attr("y",0)
		.attr("width", GET_TABLE_WIDTH())
		.attr("height", ROW_HEIGHT-2)

	row.append("text")
		.attr("class", "state standard tableText")
		.attr("y", 6 + ROW_HEIGHT/2)
		.text(function(d){ return d.state })

	row.append("text")
		.attr("class", "state standard tableText")
		.attr("y", 6 + ROW_HEIGHT/2)
		.attr("x", getColumnWith("state", 1))
		.text(function(d){
			var demographic = getActiveDemographic();
			return POPULATION(d[demographic + "Pop"])
		})

	buildDotPlot(row, getActiveDemographic(), "state")







}

function updateStateTable(demographic){
	var sorting = getStateSort()
	var x = getXScale()

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
			sortStateTable(sorting)
		})

	d3.selectAll(".state.dotLabel.low")
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "Low"])
		})
		.transition()
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})

	d3.selectAll(".state.dotLabel.medium")
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "Medium"])
		})
		.transition()
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})

	d3.selectAll(".state.dotLabel.high")
		.text(function(d){
			return PERCENT(d[demographic + "Percent" + "High"])
		})
		.transition()
		.attr("x", function(d){
			return x(d[demographic + "Percent" + "High"])
		})

}

function sortStateTable(sorting){
	var demographic = getActiveDemographic()
	var data = d3.selectAll(".state.row").data()

	d3.selectAll(".tableHeader.active").classed("active", false);
	d3.select(".tableHeader." + sorting).classed("active", true)

	if(sorting == "miscount"){
		data.sort(function(a, b) {
		    return a[demographic + "PercentHigh"] - b[demographic + "PercentHigh"]
		});
	}
	else if(sorting == "alphabetical"){
		data.sort(function(a, b) {
		    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
		    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

	    	return (textA < textB || textA == "US TOTAL") ? -1 : (textA > textB) ? 1 : 0;
		});
	}
	else if(sorting == "projection"){
		data.sort(function(a, b) {
		    return b[demographic + "Pop"] - a[demographic + "Pop"]
		});
	}


	var fips = data.map(function(o){ return o.fips })
	for(var i = 0; i < fips.length; i++){
		d3.select(".state.row.fips_" + fips[i])
			.transition()
			.duration(DURATION)
			.delay(i * 20)
			.attr("transform", "translate(0," + (1+ i * ROW_HEIGHT) + ")")
	}

}



d3.json("data/data.json", function(data){
	data.sort(function(a, b) {
	    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
	    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

	    return (textA < textB ) ? -1 : (textA > textB) ? 1 : 0;
	});

	buildDemographicMenu();
	buildStateTable(data);
	buildMap(data)
	buildDemographicTable(data)
	d3.selectAll(".customRadioRow")
		.on("click", function(){
			if(d3.select(this).classed("state")){
				showSection("state")
			}else{ showSection("demographics") }

		})

})



