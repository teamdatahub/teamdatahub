/**
 * YearBrush
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
YearBrush = function(_parentElement, _data,_eventHandler) {
  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;
  this.data = _data;

  // Define all "constants" here
  this.margin = {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
YearBrush.prototype.initVis = function() {
  var that = this;
  this.svg = this.parentElement.append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    .append("g");
  this.x = d3.time.scale().range([0, this.width]).domain(d3.extent(this.data, function (d) { return d.date}));
  this.y = d3.scale.linear()
    .range([this.height, 0])
    .domain([0,
      d3.max(this.data, function (d) { return (isNaN(d.total)) ? 0 : d.total })]);

  this.xAxis = d3.svg.axis()
    .scale(this.x).ticks(25)
    .orient("bottom");

  this.brush = d3.svg.brush().x(this.x)
    .on("brush", function() {
      // Trigger selectionChanged event. You'd need to account for filtering by time AND type
      $(that.eventHandler).trigger("selectionChanged", [that.brush.extent()[0], that.brush.extent()[1], that.brush.empty()])
    });

  this.area = d3.svg.area()
    .interpolate("basis")
    .defined(function(d) { return (!isNaN(d.total)); })
    .x(function(d) { return that.x(d.date); })
    .y0(function(d) { return that.y(0); })
    .y1(function(d) { return that.y(d.total); });

 // Add axes visual elements
  this.svg.append("g")
    .attr("class", "year axis")
    .call(this.xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("transform", function(d) {
        return "translate(15,"+(that.height/2)+") rotate(90)" });

  this.svg.append("path")
      .datum(this.data)
      .attr("class", "area")
      .attr("d", this.area)
      .attr("opacity",0.3);
  this.svg.append("g")
    .attr("class", "brush")
  this.svg.select(".brush")
    .call(this.brush)
    .selectAll("rect")
    .attr("height", this.height);

}
