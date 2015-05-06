/**
 * AgeVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AgeVis = function(_parentElement, _data,_eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
    // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 30,
      left: 30
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function() {
  var that = this;

  this.x = d3.scale.linear()
    .range([that.margin.left, this.width])
    .domain([16,80]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom")
    .ticks(6);

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left")
    .ticks(5);

  this.area = d3.svg.area()
    .interpolate("basis")
    .x(function(d,i) { return that.x(i); })
    .y0(that.y(0))
    .y1(function(d,i) { return that.y(d); });

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+this.height+")")
      .call(this.xAxis)
      .append("text")
      .attr("transform", "translate("+this.width+",-20)")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Age");

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+this.margin.left+",0)")
      .append("text")
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+") rotate(-90)")
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("Count");

  this.svg.append("g")
    .attr("class","chart title")
    .attr("transform", "translate("+(this.width/2 - 50)+",24)")
    .append("text")
    .style('fill', '#217D1C')
    .text("Age Distribution*");


  // // filter, aggregate, modify data
  this.wrangleData(null);

  this.path = this.svg.append("path")
    .datum(this.displayData)
    .attr("class", "area")
    .attr("opacity", 0.8)

  this.warning = this.svg.append("g")
    .attr("transform","translate("+(this.width/4)+","+(this.height/2)+")")
    .append("text").attr("id","warning")

  // call the update method
  this.updateVis();
}

AgeVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

AgeVis.prototype.updateVis = function() {
  var that = this;

  this.y.domain([0,d3.max([d3.max(that.displayData),5000])]);

  this.svg.select(".y.axis")
    .call(this.yAxis)

  this.path.datum(this.displayData)
    .attr("d", this.area);
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange = function(from,to,status) {
  var myDate = d3.time.format("%_m/%_d/%Y").parse('9/30/2012');

  if (status) {
    this.svg.select("#warning").html("");
    this.wrangleData(null)
  } else if (from > myDate) {
    this.svg.select("#warning").html("Ages available through 9/30/2012")
  } else {
    this.svg.select("#warning").html("");
    this.wrangleData(function(d) {
      return ((d.date >= from) && (d.date <= to))
    });
  };
  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

AgeVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter =  _filter;
  }

  var that = this;

  var res = d3.range(81).map(function () { return 0});
  this.data.filter(filter).forEach(function (e) {
    e.ages.forEach(function (d,i) {
      res[i] += d;
    })
  });
  return res;
}
