d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  }); 
};

//clipboard functions from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function getQueryString(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function containsDuplicate(array, val){
	return array.indexOf(val) !== array.lastIndexOf(val)
}


function IS_SMALL_DESKTOP(){
	return ( d3.select("#breakpoint1200").style("display") == "block" && d3.select("#breakpoint1010").style("display") == "none" )
}
function IS_TABLET(){
	return ( d3.select("#breakpoint1010").style("display") == "block" && d3.select("#breakpoint768").style("display") == "none" )
}
function IS_PHONE(){
	return ( d3.select("#breakpoint768").style("display") == "block")
}

var ROW_HEIGHT = (IS_PHONE()) ? 240 : 54;
var CARD_HEIGHT = 200;
var ROW_EXPAND = 35;
var GET_TABLE_WIDTH = function(){
	return (IS_SMALL_DESKTOP() || IS_TABLET() || IS_PHONE()) ? d3.select("#mainContent").node().getBoundingClientRect().width: 700;
}
var GET_CARD_WIDTH = function(){
	return GET_TABLE_WIDTH()
}
var GET_MAP_WIDTH = function(){
	return d3.min([900, GET_TABLE_WIDTH()])
}
var GET_MAP_HEIGHT = function(){
	return (450 / 700) * GET_MAP_WIDTH()
}
var GET_MAP_SCALE = function(){
	return (2750/700) * GET_MAP_WIDTH()
}
var GET_MAP_TRANSLATE = function(){
	return [ (325/700)*GET_MAP_WIDTH() , (176/450)*GET_MAP_HEIGHT() ]
}

var CHART_WIDTH = function(){
	return (53 / 700) * GET_MAP_WIDTH();
}
var BAR_WIDTH = function(){
	return (CHART_WIDTH() - 11)/3
}
var GET_MEEPLE_WIDTH = function(){
	return (IS_SMALL_DESKTOP() || IS_TABLET()) ? 770 : 700;
}
var POPULATION_NO_SIGN= function(number){
	return d3.format(",.0f")(Math.round(number/100)*100);
}

var POPULATION = function(number){
	var pop = (Math.abs(number) < 50) ? "-50&ndash;50" : d3.format(",.0f")(Math.round(number/100)*100);
	return (number < 0) ? pop : "+" + pop;
}
var PERCENT = function(number){
	if(number == 0) return "0%"
	return (number < 0) ? d3.format(".0%")(number) : "+" + d3.format(".0%")(number)
}
var PERCENT_LONG = function(number){
	return (number < 0) ? d3.format(".2%")(number) : "+" + d3.format(".2%")(number)
}

var PERCENT_MIN = -.07;
var PERCENT_MAX = .02;

var DOT_RADIUS = 6.5;

var BODY_RADIUS = 60;
var HEAD_RADIUS = 40;


var CHART_MARGIN = 5;

var DURATION = 500;


var headerTooltips = {
	"projection" : "These projections represent a population count that factors in demographic changes through April 1, 2020.",
	"miscount": "A miscount can be an overcount or undercount. The farther the value is to the left, the greater the undercount of that state or demographic group. When viewed in either ascending or descending order, the states and demographics are sorted by the high-risk scenario value."
}

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



var temp_categories = [
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
		"top": "Hispanic/Latinx",
		"key": "latinx",

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