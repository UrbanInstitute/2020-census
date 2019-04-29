d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


var ROW_HEIGHT = 54;
var ROW_EXPAND = 35;
var GET_TABLE_WIDTH = function(){
	return 700;
}

var POPULATION = function(number){
	return d3.format(",.0f")(number)
}
var PERCENT = function(number){
	return d3.format(".0%")(number)
}
var PERCENT_LONG = function(number){
	return d3.format(".2%")(number)
}

var PERCENT_MIN = -.07;
var PERCENT_MAX = .02;

var DOT_RADIUS = 6.5;

var BODY_RADIUS = 60;
var HEAD_RADIUS = 40;

var CHART_WIDTH = 53;
var CHART_MARGIN = 5;

var DURATION = 500;


var categories = [
	{
		"top": "Overall",
		"key": "total"
	},
	{
		"top" : "Race",
		"key" : "race",
		"sub": [
			{"label": "White, non-Hispanic/Latinx", "key": "white"},
			{"label": "Black", "key": "black"},
			{"label": "American Indian/Alaska Native", "key": "native"},
			{"label": "Asian American/Native Hawaiian/Pacific Islander", "key": "asian"}
		]
	},
	{
		"top": "Ethnicity",
		"key": "ethnicity",
		"sub": [
			{"label": "Hispanic/Latinx", "key": "latinx"},
		]

	},
	{
		"top" : "Age",
		"key" : "age",
		"sub": [
			{"label": "0&ndash;4", "key": "age0"},
			{"label": "5&ndash;17", "key": "age5"},
			{"label": "18&ndash;29", "key": "age18"},
			{"label": "30&ndash;49", "key": "age30"},
			{"label": "50+", "key": "age50"}
		]
	},

]