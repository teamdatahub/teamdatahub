/**
 * ProgressVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ProgressVis = function(_parentElement, _data,_eventHandler) {
  this.parentElement = _parentElement;
  this.routeData = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [{type:"dist",values:[]}];
  this.total = 0;
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 30,
      left: 30,
      padding: 18
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ProgressVis.prototype.initVis = function() {
  var that = this;
  var parseDate = d3.time.format("%_m/%_d/%Y %H:%M:%S").parse;



  this.x = d3.time.scale()
    .range([this.margin.left, this.width]).domain([parseDate('7/28/2011 00:00:00'),parseDate('11/30/2013 00:00:00')]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom")
    .ticks(12);

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left")
    .ticks(5);

  this.line = d3.svg.line()
  	.interpolate("basis")
    .defined(function(d) { return d.tripType != "blue"; })
    .x(function(d) { return that.x(d.date); })
    .y(function(d) { return that.y(d.dist); });

  this.area = d3.svg.area()
    .interpolate("basis")
    .defined(this.line.defined())
    .x(function(d) { return that.x(d.date); })
    .y0(that.y(0))
    .y1(function(d) { return that.y(d.dist); });

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+this.height+")");

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+this.margin.left+",0)")
      .append("text")
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+") rotate(-90)")
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("Miles covered");

  this.svg.select(".x.axis")
    .call(this.xAxis);
}

ProgressVis.prototype.tick = function(i,_trip) {
  if (i == 0) { this.onReset(_trip); }
  else { this.filterAndAggregate(_trip);}
}

ProgressVis.prototype.onReset = function (_trip) {
  this.total = 0;
  this.displayData[0].values = [];
  this.filterAndAggregate(_trip);
}

ProgressVis.prototype.updateVis = function() {

  var that = this;
  var formatDate = d3.time.format("%b %_d, %Y");

  this.y.domain([0,this.getDomain()]);

  this.svg.select(".y.axis")
    .call(this.yAxis);

  var user = this.svg.selectAll(".user")
      .data(that.displayData);

  user.enter().append("g")
      .attr("class", "user")
      .append("path")
      .attr("class", "area");

  user.select('.area').attr("d", function(d) { return that.area(d.values); })
      .transition()
      .style("fill", "greenyellow")
      .style("opacity", 0.8);

  var line = this.svg.selectAll(".userline")
  	  .data(this.displayData);

  line.enter().append("g")
  	  .attr("class","userline")
  	  .append("path")
	    .attr("class","line");

  line.select(".line")
  	  .attr("d",function (d) { return that.line(d.values)})
  	  .style("stroke", "yellowgreen");

  user.exit().remove();
  line.exit().remove();

}
ProgressVis.prototype.filterAndAggregate = function(_trip) {
  // Set filter to a function that ac{
    var trip = _trip;
    this.total += (trip.tripType == "greenyellow") ? this.routeData[trip.origdest].dist : 0;
    trip.dist = this.total;
    this.displayData[0].values.push(trip);
    this.updateVis();

};

ProgressVis.prototype.getDomain = function () {
  var that = this;
  var max = d3.max(that.displayData[0].values, function (d) { return d.dist });
  return Math.ceil(max/500)*500;
};
