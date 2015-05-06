/**
 * WhenVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhenVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.breakdown = ['total'];
  this.yVariable = ['commuter','leisure'];

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 60,
      left: 45
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}


WhenVis.prototype.initVis = function() {
  var that = this;
  this.color = d3.scale.ordinal().domain([0,1]).range(["lightgreen","darkgreen"]);
  //this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  var formatTime = d3.time.format("%H:%M"),
      formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

  this.x = d3.scale.linear()
    .domain([0,1440])
    .range([this.margin.left, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .tickFormat(formatMinutes)
    .ticks(20)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");

  this.line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return that.x(d.x); })
    .y(function(d) { return that.y(d.y); });

  this.area = d3.svg.area()
    .interpolate("basis")
    .defined(this.line.defined())
    .x(function(d) { return that.x(d.x); })
    .y0(that.y(0))
    .y1(function(d) { return that.y(d.y); });

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+this.height+")")
      .append("text")
      .attr("x",this.width/2)
      .attr("y",40)
      .text("time of day");

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+this.margin.left+",0)")
      .append("text")
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+") rotate(-90)")
      .attr("y",-30)
      .attr("x",-30)
      .style("text-anchor", "end")
      .text("");

  this.yAxisLabel = this.svg.select('.y.axis').select('text');

  this.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span class='highlight'>"+d.type+"</span>";
  })

  this.svg.call(this.tip);

  this.wrangleData();
  // // call the update method
  this.updateVis();
}

WhenVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WhenVis.prototype.updateVis = function() {
  var that = this;
  this.y.domain([0, d3.max(that.displayData, function (d) {
      return d3.max(d.points, function (a) {return a.y;})})]);

  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);
  var lbl = (this.yVariable[0] == 'speed') ? "speed (mph)" : "count";
  lbl = (this.yVariable[0] == 'dist') ? "average distance per trip (miles)" :lbl;
  lbl = (this.yVariable[0] == 'duration') ? "average time per trip (minutes)" : lbl;
  this.yAxisLabel.text(lbl)

  var area = this.svg.selectAll(".area")
      .data(that.displayData);

  area.enter().append("g")
      .attr('class','area')
      .on('mouseover', this.tip.show)
      .on("mousemove", function(){return that.tip.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");})
      .on('mouseout', this.tip.hide)
      .append("path")
      .attr("class", "areaPath");

  area.select('path').transition()
      .attr("d", function(d) { return that.area(d.points); })
      .transition().duration(300)
      .style("fill", function(d,i) {return that.color(i)})
      .style("opacity", 0.5);

  var line = this.svg.selectAll(".line")
      .data(this.displayData);

  line.enter().append("g")
      .attr('class','line')
      .on('mouseover', this.tip.show)
      .on("mousemove", function(){return that.tip.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");})
      .on('mouseout', this.tip.hide)
      .append("path")
  line.select("path").transition().duration(300)
      .attr("d",function (d) { return that.line(d.points)})
      .style("stroke", function(d,i) {return that.color(i)});


  var text = this.svg.selectAll(".datalabel")
      .data(that.displayData);

  text.enter().append("text")
    .attr("class","datalabel");

  text.select('text')
    .attr("transform","translate(100,100)")
    .text(function (d) { console.log(d); return d.type})
  area.exit().remove();
  line.exit().remove();
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

WhenVis.prototype.onSelectionChange = function() {
  var myDom = {
      gender: ['male','female'],
      total: ['total'],
      weekend: ['weekend'],
      weekday: ['weekday'],
      commute: ['commuter','leisure'],
      registered: ['registered','casual'],
      dist: ['dist'],
      speed:['speed'],
      duration: ['duration']
  };
  var breakdown = d3.select('#formgroup').selectAll('.formgroup2.active');
  var yVariable = d3.select('#formgroup').selectAll('.formgroupy.active');
  breakdown = (breakdown.node()) ? breakdown.node().value : 'total';
  yVariable = (yVariable.node()) ? yVariable.node().value : 'total';
  console.log(yVariable)
  this.yVariable = myDom[yVariable];
  this.breakdown = [breakdown]
  this.wrangleData();
  this.updateVis();
}

WhenVis.prototype.onTypeChange = function(_dom) {
  if (this.dom != _dom) {
  	this.dom = _dom;
  	this.wrangleData(this.filter);
  	this.updateVis();
  }
}
/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

WhenVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var that = this;
  var res = [];
  that.yVariable.forEach(function (t) {
    that.breakdown.forEach(function (w) {
      res.push({
        type: t+" "+w,
        points: that.data.map(function (d) {
          return {x: d.timeofday, y: d[t][w]}
        })
      })
    })
  });
  return res;
}

// WhenVis.prototype.mouseover = function() {
//   d3.selectAll(".area").style("opacity",0.3);
//   d3.selectAll(".line").style("stroke","2px");
//   d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
// }
// WhenVis.prototype.mouseout = function() {
//   d3.selectAll(".area").style("opacity",0.6)
//   d3.selectAll(".line").style("stroke","2px")
// }
