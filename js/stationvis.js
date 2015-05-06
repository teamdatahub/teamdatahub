/**
 * StationVis
 * @param _whoParentElement -- the HTML or SVG element (D3 node) to which to attach the who vis
 * @param _originParentElement -- the HTML or SVG element (D3 node) to which to attach the top 5 origins vis
 * @param _destParentElement -- the HTML or SVG element (D3 node) to which to attach the top 5 destinations vis
 * @param _timeParentElement -- the HTML or SVG element (D3 node) to which to attach the hourly traffic vis
 * @param _stationData -- the data for stations
 * @param _routeData -- the data for routes
 * @constructor
 */
StationVis = function(_whoParentElement,_originParentElement,_destParentElement,_timeParentElement,_stationData, _routeData) {
  this.whoParentElement = _whoParentElement;
  this.originParentElement = _originParentElement;
  this.destParentElement = _destParentElement;
  this.timeParentElement = _timeParentElement;

  this.stationData = _stationData;
  this.routeData = _routeData;
  this.displayData = [];
  this.disp = 0;

  // Define all "constants" here
  this.margin = {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    },
  this.width = 340 - this.margin.left - this.margin.right,
  this.height = 220 - this.margin.top - this.margin.bottom;

  // set up SVG
  this.initVis();
};

/**
 * Method that sets up the SVG and the variables
 */
StationVis.prototype.initVis = function() {

  this.whosvg = this.whoParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.originsvg = this.originParentElement.append("svg")
    .attr("width", this.width + 10 + this.margin.left + this.margin.right)
    .attr("height", this.height + 55 + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.destsvg = this.destParentElement.append("svg")
    .attr("width", this.width + 10 + this.margin.left + this.margin.right)
    .attr("height", this.height + 55 + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.timesvg = this.timeParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height  + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    .attr("fill","white");

};


StationVis.prototype.updateVis = function(id) {

    // updates four svgs on change of station
    // **************************************
    // whosvg -- breakdown of users for a station
    // originsvg -- bar graph of top 5 origins
    // destsvg -- bar graph of top 5 destinations
    // whensvg -- line of hourly data

    var that = this;
    station = that.stationData[id];

    // update station data
    $('#station-name').html(station.fullname);
    $('#station-amt').html(Math.round(station['overall']['average']['t'])+ " trips per day");

    // create data for layering
    var data = [ { "key": "Male", "values": [ {"x": "Male",  "y": station.overall.average.t - station.overall.average.f} ] },
                 { "key": "Female", "values": [ {"x": "Female",  "y": station.overall.average.f} ] },
                 { "key": "Unregistered", "values": [ {"x": "Unregistered",  "y": station.overall.average.t - station.overall.average.r} ] },
                 { "key": "Registered", "values": [ {"x": "Registered",  "y": station.overall.average.r} ] },
                 { "key": "Leisure", "values": [ {"x": "Leisure",  "y": station.overall.average.t - station.overall.average.c} ] },
                 { "key": "Commuting", "values": [ {"x": "Commuting",  "y": station.overall.average.c} ] }
               ];

    // USER BREAKDOWNS
    // ***************
    // whosvg

    var y = d3.scale.linear()
      .domain([0, station.overall.average.t])
      .range([0, this.width-40]);
    var colors = [ '#217D1C', '#399F2E'];
    var stack = d3.layout.stack().values(function(d){ return d.values;}),
    layers = stack(data);

    var who_rects = this.whosvg.selectAll("rects")
      .data(layers);

    who_rects.enter().append("rect")
      .style("fill", function (d,i) { if (i%2 == 0) return colors[0]; else return colors[1];})
      .attr("width", 0)
      .transition()
      .duration(800)
      .attr("width", function(d) { return y(d.values[0].y);})
      .attr("height", 35)
      .attr("x", function (d, i) { return y(d.values[0].y0) - Math.floor(i/2)*280;})
      .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 30;});

    who_rects.exit().transition()
      .style("fill", '#fff')
      .duration(800)
      .remove();

    var who_labels = this.whosvg.selectAll("text")
      .data(layers)

    who_labels.enter().append("text")
      .style('fill', '#fff')
      .attr("x", function (d, i) { if (i%2 == 0) return 0; else return y(station.overall.average.t);})
      .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 23;})
      .attr("dy", ".35em")
      .text(function(d) { return d.key; })
      .style('class', 'lead')
      .style('text-anchor', function (d,i) { if (i%2 == 0) return 'start'; else return 'end'; });

    who_labels.exit().remove();


    // TOP DESTINATIONS
    // ***************
    // destsvg

    var destinations = [];
    for (var route in station.routes)
        destinations.push([route, station.routes[route]]);
    destinations.sort(function(a, b) {return b[1] - a[1]})
    destinations = destinations.slice(0,5);

    var x_dest = d3.scale.linear()
      .domain([0, destinations[0][1] ])
      .range([0, this.width-80]);

    // vertical bars for top 5 destinations
    var dest_rects = this.destsvg.selectAll("rect")
      .data(destinations);
    var dest_rects_enter = dest_rects.enter().append("rect");
    dest_rects
      .attr("y", function(d, i) { return i*55 + 20; })
      .attr("x", 0)
      .attr("width", function(d) { return x_dest(d[1]); })
      .attr("height", 30)
      .style("fill", "#399F2E");
    dest_rects.exit().remove();

    // labels for top 5 destinations
    var dest_num_labels = this.destsvg.selectAll(".numlabels")
      .data(destinations);
    var dest_num_labels_enter = dest_num_labels.enter().append("text").attr('class', 'numlabels');
    dest_num_labels
      .style('font-size', '10px')
      .style('font-weight', '800')
      .style('fill', 'white')
      .text( function (d) { return d[1]; })
      .attr("y", function(d, i) { return i*55 + 37; })
      .attr("x", function(d) { return x_dest(d[1]) -25; });
    dest_num_labels.exit().remove();

    var dest_text_labels = this.destsvg.selectAll(".textlabels")
      .data(destinations);
    var dest_text_labels_enter = dest_text_labels.enter().append("text").attr('class', 'textlabels');
    dest_text_labels
      .style('class', 'text-labels')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', '#555')
      .text( function (d) { return that.stationData[d[0]].short; })
      .attr("y", function(d, i) { return i*55 + 17; })
      .attr("x",0);
    dest_text_labels.exit().remove();

    // TOP ORIGINS
    // ***************
    // originsvg

    var origins = [];
    for (var key in this.stationData)
        origins.push([key, this.stationData[key].routes[id]]);
    origins.sort(function(a, b) {return b[1] - a[1]})
    origins = origins.slice(0,5);

    var y_origin = d3.scale.linear()
      .domain([0, origins[0][1] ])
      .range([0, this.width-80]);

    // vertical bars for top 5 origins
    var origin_rects = this.originsvg.selectAll("rect")
      .data(origins);
    var origin_rects_enter = origin_rects.enter().append("rect");
    origin_rects
      .attr("y", function(d, i) { return i*55 + 20; })
      .attr("x", 0)
      .attr("width", function(d) { return y_origin(d[1]); })
      .attr("height", 30)
      .style("fill", "#399F2E");
    origin_rects.exit().remove();

    // labels for top 5 origins
    var origin_num_labels = this.originsvg.selectAll(".numlabels")
      .data(origins);
    var origin_num_labels_enter = origin_num_labels.enter().append("text").attr('class', 'numlabels');
    origin_num_labels
      .style('font-size', '10px')
      .style('font-weight', '800')
      .style('fill', 'white')
      .text( function (d) { return d[1]; })
      .attr("y", function(d, i) { return i*55 + 37; })
      .attr("x", function(d) { return y_origin(d[1]) -25; });
    origin_num_labels.exit().remove();

    var origin_text_labels = this.originsvg.selectAll(".textlabels")
      .data(origins);
    var origin_text_labels_enter = origin_text_labels.enter().append("text").attr('class', 'textlabels');
    origin_text_labels
      .style('class', 'text-labels')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', '#555')
      .text( function (d) { return that.stationData[d[0]].short; })
      .attr("y", function(d, i) { return i*55 + 17; })
      .attr("x", 0);
    origin_text_labels.exit().remove();


    // HOURLY WHEN
    // ***************
    // timesvg
    var timeColor = ["crimson","lightgreen"];

    var ratesArr = this.stationData[id].overall.hourly.map(function (e,i) { return {x:i,y:e.a }})
    var ratesDep = this.stationData[id].overall.hourly.map(function (e,i) { return{x:i,y:e.d }})
    var rates = [ratesArr,ratesDep]

    var time_x = d3.scale.linear()
      .domain([0, 23])
      .range([0, this.width-40]);

    var time_y = d3.scale.linear()
      .domain([0,d3.max(rates, function (d) { return d3.max(d, function (a) { return a.y})})])
      .range([this.height-20,0]);

    var timeXAxis = d3.svg.axis()
      .scale(time_x)
      .ticks(10)
      .orient("bottom");

    this.timesvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+(this.height-20)+")")
        .call(timeXAxis)
        .attr("fill",'black')
        .attr("font-size",9)
        .attr('font-weight','regular');
    this.timesvg.append("g")
        .attr("transform", "translate(0,10)")
        .append("text")
        .text("hour of day")
        .attr('fill','black');

    var lineFunction = d3.svg.line()
       .x(function(d) { return time_x(d.x); })
       .y(function(d) { return time_y(d.y); })
       .interpolate("basis");

    var path = this.timesvg.selectAll(".line")
        .data(rates);

    var path_enter = path.enter().append("path").attr("class","line");

    path
        .attr("d", lineFunction)
        .attr("stroke-width", 2)
        .attr("stroke",function (d,i) {return timeColor[i]})
        .attr("fill", "none");
    path.exit().remove()
    var areaFunction = d3.svg.area()
       .x(function(d) { return time_x(d.x); })
       .y0(time_y(0))
       .y1(function(d) { return time_y(d.y); })
       .interpolate("basis");

    var area = this.timesvg.selectAll(".area")
        .data(rates);

    var area_enter = path.enter().append("path").attr("class","area");

    area.attr("d", areaFunction)
        .attr("fill",function (d,i) {return timeColor[i]})
        .attr("opacity",0.3)
    area.exit().remove();
};





/**
 * Gets called to update station id
 * @param selection
 */
StationVis.prototype.onSelectionChange = function(id) {
    this.updateVis(id);
};
