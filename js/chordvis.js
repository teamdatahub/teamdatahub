/**
 * ChordVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ChordVis = function (_parentElement,_metaData, _eventHandler) {
  this.parentElement = _parentElement;
  this.neighborhoods = _metaData;
  this.eventHandler = _eventHandler;
  this.display = 'all';

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      padding:60
    },
  this.width = this.parentElement.node().clientWidth,
  this.height = this.parentElement.node().clientHeight,
  this.outerRadius = Math.min(this.width, this.height) / 2 - this.margin.padding,
  this.innerRadius = this.outerRadius - 36;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ChordVis.prototype.initVis = function() {

    var that = this;

    this.matrix = _matrixData;
    var formatPercent = d3.format(".1%");
    var formatInt = d3.format(",");


    this.arc = d3.svg.arc()
    .innerRadius(this.innerRadius)
    .outerRadius(this.outerRadius);

    this.layout = d3.layout.chord()
    .padding(.1)
    .sortSubgroups(d3.ascending)
    .sortChords(d3.ascending);

    this.path = d3.svg.chord()
    .radius(this.innerRadius);

    this.svg = this.parentElement.append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr("id", "circle").attr("fill","none")
    .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

    this.svg.append("circle")
    .attr("r", this.outerRadius);

    this.tipGroup = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#399F2E'>"+ that.neighborhoods[d.index].name + "</span><br>" + formatPercent(d.value/that.displayData.total) + " of origins";
      })
    this.tipChord = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        if (d.source.index == d.target.index) {
          return "<span style='color:#399F2E'>Within " + that.neighborhoods[d.source.index].name + ":</span> "
                  + d.source.value + " trips"
        }
        else {
          return "<span style='color:#399F2E'>"+ that.neighborhoods[d.source.index].name
                 + " → " + that.neighborhoods[d.target.index].name 
                 + ": </span>" + formatInt(d.source.value)
                 + "<br><span style='color:#399F2E'>" + that.neighborhoods[d.target.index].name
                 + " → " + that.neighborhoods[d.source.index].name
                 + ": </span>" + formatInt(d.target.value);
       }
     })

    this.svg.call(this.tipGroup);
    this.svg.call(this.tipChord);

    // filter, aggregate, modify data
    this.wrangleData();

    this.updateVis();

}

ChordVis.prototype.wrangleData = function() {
    this.displayData = this.filterAndAggregate();
}

ChordVis.prototype.updateVis = function() {
    var that = this;
    var color = d3.scale.category20c();

    // Compute the chord layout.
    this.layout.matrix(this.matrix);

    // Add a group per neighborhood.
    var group = this.svg.selectAll(".group")
      .data(this.layout.groups)

    var group_enter = group.enter().append("g")
      .attr("class", "group");

    group.attr("d",this.arc).transition().duration(300);
    group_enter.append("text");
    group_enter.append("path");

    group.select("text")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
        .transition()
        .duration(300)
        .attr("transform", function(d) {
        return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
            + "translate(" + (that.outerRadius +5) + ")"
            + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d,i) {
            return that.neighborhoods[i].name;
        })
        .style("font-size","10px")
        .style("fill", "black")
        .style("z-index", "10000")

    group.select('path')
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", this.arc)
//      .style("fill", function(d, i) { console.log(i); return color[i]; })
      .style("fill", function(d, i) { return color(i); })
      .on("mouseover", mouseoverGroup)
      .on("mouseout", mouseoutGroup)
      .on("click",function(d,i) {
        $(that.eventHandler).trigger("hoodChanged",that.neighborhoods[i].name)
      })
      .on("mousemove", function(){return that.tipGroup.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");});

    // Add the chords.
    var chord = this.svg.selectAll(".chord")
      .data(this.layout.chords)

    var chord_enter = chord.enter()
      .append("path")
      .attr("class", "chord")

    chord
      .attr("d", this.path)
      .style("fill", function(d) {return color(d.source.index); })
      .on("mouseover",this.tipChord.show)
      .on("mouseout",this.tipChord.hide)
      .on("mousemove", function(){return that.tipChord.style("top", (event.pageY+20)+"px").style("left",event.pageX+"px");});


    chord.exit().remove()
    group.exit().remove();

    function mouseoverGroup(d, i) {
      chord.classed("fade", function(p) {
        return p.source.index != i && p.target.index != i;
      });
      that.tipGroup.show(d);
    }
    function mouseoutGroup(d, i) {
      chord.classed("fade", false);
      that.tipGroup.hide(d);
    }

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ChordVis.prototype.onSelectionChange = function(d) {
  var that = this;
  console.log(d);
  if (d !== that.display) {
  	that.display = d;
  	if (that.display =='all') {
  		that.matrix = _matrixData;
  	}
  	else if (that.display =='registered') {
  		that.matrix = _matrixRegisteredData;
  	}
  	else if (that.display =='casual') {
  		that.matrix = _matrixCasualData;
  	}
    else if (that.display =='weekend') {
  		that.matrix = _matrixWeekendData;
    }
    else if (that.display =='weekday') {
    	that.matrix = _matrixWeekdayData;

    };
    this.wrangleData();
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

ChordVis.prototype.filterAndAggregate = function() {
 	var that = this;
  // Set filter to a function that accepts all items
  var arrOrigins = d3.range(that.neighborhoods.length).map(function (d) { return 0});
  var sumOrigins = 0;

  this.matrix.forEach(function (row,i) {
  	sumOrigins += d3.sum(row);
  	arrOrigins[i] = d3.sum(row)
  });

  return {total: sumOrigins, origins : arrOrigins };
}
