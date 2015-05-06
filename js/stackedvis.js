/**
 * StackedVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
StackedVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ["total"];
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
StackedVis.prototype.initVis = function() {
  var that = this;

  var color_list = [];
    color_list[1] = colorbrewer.Greens[9][5];
    color_list[2] = colorbrewer.Greens[9][1];
    color_list[3] = colorbrewer.Greens[9][2];
    color_list[4] = colorbrewer.Greens[9][6];
    color_list[5] = colorbrewer.Greens[9][7];
    color_list[6] = colorbrewer.Greens[9][3];
    color_list[7] = colorbrewer.Greens[9][4];
    color_list[8] = colorbrewer.Greens[9][8];

  this.color = d3.scale.ordinal().domain(colorDomain).range(color_list);
  this.x = d3.time.scale()
    .range([this.margin.left, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom")
    .ticks(5);

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");
  this.line = d3.svg.line()
  	.interpolate("basis")
    .defined(function(d) { return d.value != null; })
    .x(function(d) { return that.x(d.date); })
    .y(function(d) { return that.y(d.value); });

  this.area = d3.svg.area()
    .interpolate("basis")
    .defined(this.line.defined())
    .x(function(d) { return that.x(d.date); })
    .y0(that.y(0))
    .y1(function(d) { return that.y(d.value); });

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
    .attr("class","chart title")
    .attr("transform", "translate("+(this.width/2 - 100)+",24)")
    .append("text")
    .style('fill', '#217D1C')
    .text("Daily Trips Over Time");


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
      .text("Count");

  this.focus = this.svg.append("g")
    .append("rect")
    .attr("class","focus")
    .attr("x",0)
    .attr("y",that.margin.top)
    .attr("height",that.height-that.margin.top)
    .attr("width","2px")
    .attr("fill","#399F2E")
    .attr("display",'none');

  this.focustext = this.svg.append("g").attr("class","focustext").attr("display","none").attr('font-weight', '200')

  this.focustext.append('text').attr("class","date").attr("stroke","#399F2E");
  this.focustext.append('text').attr("class","value1").attr("stroke","#555").attr("transform","translate(0,16)");
  this.focustext.append('text').attr("class","value2").attr("stroke","#555").attr("transform","translate(0,32)");

  // // filter, aggregate, modify data
  this.wrangleData(this.filter);

  // // call the update method
  this.updateVis();
}

StackedVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

StackedVis.prototype.updateVis = function() {

  var that = this;
  var formatDate = d3.time.format("%b %_d, %Y")
  this.x.domain(d3.extent(that.displayData[0].values, function(d) { return d.date; }));
  this.y.domain([0,
    d3.max([1.2*d3.max(that.displayData, function (d) {
      return d3.max(d.values, function (a) {return a.value})
    }),3000])
  ]);

  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var user = this.svg.selectAll(".user")
      .data(that.displayData);

  user.enter().append("g")
      .attr("class", "user")
      .append("path")
      .attr("class", "area");

  user.select('.area').attr("d", function(d) { return that.area(d.values); })
      .transition()
      .style("fill", function(d) { return that.color(d.type); })
      .style("opacity", 0.7);

  // user.select('.area')
  //     .on("mouseover", this.mouseover)
  // 	  .on("mouseout", this.mouseout);

  var line = this.svg.selectAll(".userline")
  	  .data(this.displayData);

  line.enter().append("g")
  	  .attr("class","userline")
  	  .append("path")
	    .attr("class","line");

  line.select(".line")
  	  .attr("d",function (d) { return that.line(d.values)})
  	  .style("stroke", function (d) {return that.color(d.type)});

  user.exit().remove();
  line.exit().remove();

  this.svg.append("rect")
      .attr("class", "overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill",'none')
      .attr("pointer-events", "all")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  $(".overlay").mousemove(function (event) {
    var x = event.pageX-that.margin.left-that.margin.padding;
    that.focus.attr("x",x).attr("display",null)
    that.focustext.attr("transform", "translate("+(x+10)+",50)").attr("display",null);
    $(that.eventHandler).trigger("hoverChanged", that.x.invert(x))
  })

  $(".overlay").mouseout(function () {
    that.focus.attr("display","none");
    that.focustext.attr("display","none")
  });

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StackedVis.prototype.onSelectionChange = function(from,to,status) {
  if (status) {
    this.wrangleData(null)
  } else {
    this.wrangleData(function(d) {
      return ((d.date >= from) && (d.date <= to))
    });
  };
  this.updateVis();
}

StackedVis.prototype.onTypeChange = function(_dom) {
  if (this.dom != _dom) {
  	this.dom = _dom;
  	this.wrangleData(this.filter);
  	this.updateVis();
  }
}

StackedVis.prototype.onHoverChange = function(date) {
  var that = this;

  var formatDate = d3.time.format("%b %_d, %Y")

  if (date) {
    var sel = this.displayData.map(function (a) {
        var e = a.values.filter(function (d) {
            return that.checkDate(d.date,date) })
        return {
          type: a.type,
          value: e[0].value,
          date: e[0].date
        }
    });
    var myStr = ["",""];
    sel.forEach(function (d,i) {
      if (d.value != null) {
        myStr[i] = d.value + " " + d.type;
      }
    })
    that.focustext.select(".date").text(formatDate(sel[0].date));
    that.focustext.select(".value1").text(myStr[0]);
    that.focustext.select(".value2").text(myStr[1]);
  }
}

StackedVis.prototype.mousemove = function() {
        // i = bisectDate(data, x0, 1),
        // d0 = data[i - 1],
        // d1 = data[i],
        // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    // this.focus.attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");
    // this.focus.select("text").text("YES");
  }
/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

StackedVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    this.filter = _filter;
  } else {
  	this.filter = filter;
  }
  var that = this;
  var res = this.data.filter(this.filter);
  res = that.dom.map(function (t) {
    return {
      type: t,
      values: res.map(function (d) {
        return {date: d.date, value: isNaN(d[t]) ? null : d[t]}
      })
    }
  });
  return res;
}

StackedVis.prototype.checkDate = function(date1, date2) {
  return ((date1.getDate() == date2.getDate())
       && (date1.getFullYear() ==date2.getFullYear())
       && (date1.getMonth() == date2.getMonth()))
}

// StackedVis.prototype.mouseover = function() {
//   d3.selectAll(".area").style("opacity",0.3);
//   d3.selectAll(".line").style("stroke","2px");
//   d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
// }
// StackedVis.prototype.mouseout = function() {
//   d3.selectAll(".area").style("opacity",0.6)
//   d3.selectAll(".line").style("stroke","2px")
// }
