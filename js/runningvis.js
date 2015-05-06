/**
 * RunningVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
RunningVis = function(_parentElement,_routeData,_eventHandler) {
  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;
  this.routeData = _routeData;
  this.displayData = [];
  this.months = ['Jan',"Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]

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
RunningVis.prototype.initVis = function() {
  this.resetCounts();
  this.month = this.parentElement.select('#dateCountMonth')
  this.day = this.parentElement.select('#dateCountDay')
  this.year = this.parentElement.select('#dateCountYear')
  this.total = this.parentElement.select('#totalCount')
  this.distance = this.parentElement.select('#distCount')
  this.ttime = this.parentElement.select('#timeCount')

}


RunningVis.prototype.updateVis = function(i,trip) {
  var that = this;
  if (i == 0) { this.resetCounts(); }
  if (trip.tripType == "greenyellow") {
    var formatInt = d3.format(',');
    var formatFloat = d3.format(',.2f');
    that.timeCount += trip.duration;
    that.distCount += that.routeData[trip.origdest].dist;
    that.totalCount += 1;
    this.total.text(that.totalCount);
    this.ttime.html(that.formatTime(that.timeCount));
    this.distance.text(formatFloat(that.distCount));
    this.month.text(that.months[trip.date.getMonth()])
    this.day.text(trip.date.getDate())
    this.year.text(trip.date.getFullYear())
    }
  }


RunningVis.prototype.formatTime  = function (min) {
  var days = Math.floor(min/(24*60));
  var hours = Math.floor((min - 24*60*days)/60)
  var minutes = min % 60;
 return days + "<small>d</small> " + hours + "<small>h</small> " + minutes + "<small>m</small>";
};

RunningVis.prototype.resetCounts = function () {
  this.timeCount = 0;
  this.distCount = 0.0;
  this.totalCount = 0;
}
