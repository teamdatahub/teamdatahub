/**
 * FollowVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
FollowVis = function(_parentElement, _metaData,_eventHandler) {
  this.parentElement = _parentElement;
  this.routeData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
FollowVis.prototype.initVis = function() {
  var that = this;
  this.map = new L.mapbox.map('map', 'niamhdurfee.m3dcii07',{center: [42.35272,-71.09], zoom: 13});
  this.map.legendControl.addLegend(document.getElementById('legend').innerHTML);
  d3.entries(this.routeData).forEach( function (d) {L.Polyline.fromEncoded(d.value.polyline, {stroke:5,opacity:0,className:"trips od"+d.key}).addTo(that.map)})
  // // call the update method
  this.updateVis();
}

FollowVis.prototype.tick = function(i,trip) {
  if (i == 0) {
    d3.selectAll(".trips").attr("stroke-opacity",0).classed("taken",false);

  }

  var a = ".od" + trip.origdest;
  d3.selectAll(".taken").attr("stroke-opacity",0.1).attr("stroke-width",5);
  d3.select(a).attr("stroke-opacity",1).attr("stroke-width",8).attr("stroke",trip.tripType).classed("taken",true);

  }


FollowVis.prototype.updateVis = function() {
  var that = this;
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
FollowVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

FollowVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  }

  var that = this;

  return 0;
}
