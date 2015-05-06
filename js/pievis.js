/**
 * PieVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
PieVis = function(_parentElement, _eventHandler) {
  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;
  this.displayData = [{type:'N',nm:"Unregistered",value:0},{type:'M',nm:"Male",value:0},{type:'F',nm:"Female",value:0}];
  this.colors = ['lightgrey','skyblue','deeppink'];
  this.total = 0;

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
PieVis.prototype.initVis = function() {
  var that = this;

  var formatPercent = d3.format("%");
  var formatNum = d3.format(",")

  this.color = d3.scale.ordinal().domain(d3.keys(this.dom)).range(this.colors);

  this.arc = d3.svg.arc()
    .outerRadius(this.radius)
    .innerRadius(this.radius-40);


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
    return "<span class='highlight'>"
    + d.data.nm +"</span><br>"
     +formatPercent(d.data.value/that.total)
     +"<br><small>"
     +formatNum(d.value)+" of "+formatNum(that.total)+" trips</small></span>";
  })

  this.svg.call(this.tip);

}

PieVis.prototype.tick = function(i,_trip) {
  this.filterAndAggregate(_trip);
  this.updateVis();
}

PieVis.prototype.updateVis = function() {
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

  g.exit().remove()


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

PieVis.prototype.filterAndAggregate = function(trip) {
  var g = (trip.gender == '') ? 'N' : trip.gender;
  this.displayData.filter(function (d) { return d.type == g })[0].value += 1;
  this.total += 1;
}
