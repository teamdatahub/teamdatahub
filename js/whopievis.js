/**
 * WhoPieVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhoPieVis = function(_parentElement, _data, _dom, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = _dom;
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom,
  this.radius = Math.min(this.width, this.height) / 2;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
WhoPieVis.prototype.initVis = function() {
  var that = this;

  var formatPercent = d3.format("%");
  var formatNum = d3.format(",")

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

  this.arc = d3.svg.arc()
    .outerRadius(this.radius - 10)
    .innerRadius(0);

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

  this.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span class='highlight'>"+formatPercent(d.data.percent)+"</span><br><small>"+formatNum(d.data.value)+" of "+formatNum(d.data.total)+" trips</small></span>";
  })

  this.svg.call(this.tip);

  // // filter, aggregate, modify data
  this.wrangleData(null);

  // // call the update method
  this.updateVis();
}

WhoPieVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WhoPieVis.prototype.updateVis = function() {
  var that = this;

  var g = this.svg.selectAll(".arc")
      .data(this.pie(this.displayData))

  g.enter().append("g")
      .attr("class", "arc")
      .append("path")

  g.select("path")
      .attr("d", this.arc)
      .attr("transform","translate("+this.width/2+","+this.height/2+")")
      .style("fill", function(d) { return that.color(d.data.type); })
      .on('mouseover', this.tip.show)
      .on("mousemove", function(){return that.tip.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");})
      .on('mouseout', this.tip.hide)
      .on('click', function(d) {
      // Trigger selectionChanged event. You'd need to account for filtering by time AND type
      $(that.eventHandler).trigger("typeChanged", that.dom)});

  var gText = g.selectAll("text")
      .data(this.pie(this.displayData))

  gText.enter().append("text")
      .attr("transform", function(d) { return "translate("+(that.arc.centroid(d)[0]+that.width/2)+","+(that.arc.centroid(d)[1]+that.height/2)+")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style('text-transform', 'capitalize')
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .on("mousemove", function(){return that.tip.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");})
      .text(function(d) { return d.data.type; });

  g.exit().remove()
  gText.exit().remove()

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
WhoPieVis.prototype.onSelectionChange = function(from,to,status) {
  if (status) {
    this.wrangleData(null)
  } else {
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

WhoPieVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  };

  var that = this;
  res = that.dom.map(function (t) {
    return {
      type: t,
      value: d3.sum(that.data.filter(filter), function (d) { return d[t]})
    }
  });
  res = res.map(function (d) {
    var t = d3.sum(res, function (d) { return d.value});
    return {
      type: d.type,
      value: d.value,
      percent: d.value/t,
      total: t    }
  });
  return res;
}
