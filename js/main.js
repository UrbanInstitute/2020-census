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
function getStateSort(){
	return d3.select(".state.tableHeader.active").datum()

}
function getDemographicSort(){

}

function showSection(section){

}
function selectState(state){

}





function buildMap(data){

}

function buildStateRow(){

}

function getColumnWith(section, colNum){
	if(section == "state"){
		widths = [false, 200, 210, 210]
		return widths[colNum]
	}
}

function buildDemographicMenu(){
	var container = d3.select("#chart")
	
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
				updateStateTable(d.key)
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
				updateStateTable(d.key)
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
				updateStateTable(d.key)
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
			updateStateTable(d.key)
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
			updateStateTable(d.key)
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

function buildStateTable(data){
	

	var container = d3.select("#chart")
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
			return "state row fips_" + d.fips
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

	var chartStart = getColumnWith("state", 1) + getColumnWith("state", 2)
	var chartWidth = getColumnWith("state",3)

	var x = getXScale()

	row.append("line")
		.attr("class", "x axis")
		.attr("x1", x(PERCENT_MIN))
		.attr("x2", x(PERCENT_MAX))
		.attr("y1", 10 + ROW_HEIGHT/2)
		.attr("y2", 10 + ROW_HEIGHT/2)

	row.append("line")
		.attr("class", "y axis")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y1", 10 + ROW_HEIGHT/2 - 9)
		.attr("y2", 10 + ROW_HEIGHT/2 + 9)

	row.append("circle")
		.attr("class", "low dot")
		.attr("r", DOT_RADIUS)
		.attr("cy", 10 + ROW_HEIGHT/2)
		.attr("cx", function(d){
			var demographic = getActiveDemographic();
			return x(d[demographic + "Percent" + "Low"])
		})

	row.append("circle")
		.attr("class", "medium dot")
		.attr("r", DOT_RADIUS)
		.attr("cy", 10 + ROW_HEIGHT/2)
		.attr("cx", function(d){
			var demographic = getActiveDemographic();
			return x(d[demographic + "Percent" + "Medium"])
		})

	row.append("circle")
		.attr("class", "high dot")
		.attr("r", DOT_RADIUS)
		.attr("cy", 10 + ROW_HEIGHT/2)
		.attr("cx", function(d){
			var demographic = getActiveDemographic();
			return x(d[demographic + "Percent" + "High"])
		})




}

function updateStateTable(demographic){
	var sorting = getStateSort()
	var x = getXScale()

	d3.selectAll(".low.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Low"])
		})

	d3.selectAll(".medium.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "Medium"])
		})

	d3.selectAll(".high.dot")
		.transition()
		.attr("cx", function(d){
			return x(d[demographic + "Percent" + "High"])
		})
		.on("end", function(){
			sortStateTable(sorting)
		})

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

// function build

function buildDemographicTable(data, sorting){

}

d3.json("data/data.json", function(data){
	data.sort(function(a, b) {
	    var textA = (a.state == "US total") ? "AAA" : a.state.toUpperCase();
	    var textB = (b.state == "US total") ? "AAA" : b.state.toUpperCase();

	    return (textA < textB ) ? -1 : (textA > textB) ? 1 : 0;
	});

	buildDemographicMenu();
	buildStateTable(data);
})