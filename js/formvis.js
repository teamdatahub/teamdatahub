/**
 * FormVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
FormVis = function(_parentElement, _eventHandler) {
    
this.parentElement = _parentElement.append("div")
  .attr("class", "row")
  .attr("id", "chord-selection")
.append("div")
.attr("class", "span12");
    
//  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;

  // Define all "constants" here
  this.margin = {
      top: 0,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = 50 - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
FormVis.prototype.initVis = function() {
  var that = this;

  this.form = this.parentElement
    .append("div")
    .attr("class","btn-toolbar pagination-centered")
    .attr("role","toolbar")
    .html(       
        '<div class="btn-group" role="group">' + 
          '<button type="button" id="all" value="all" class="btn btn-default active">Overall</button>' + 
        '</div>'+
        '<div class="btn-group" role="group">' + 
          '<button type="button" id="weekend" value="weekend" class="btn btn-default">Weekend</button>' + 
          '<button type="button" id="weekday" value="weekday" class="btn btn-default">Weekday</button>'+ 
        '</div>' +   
       '<div class="btn-group" role="group">' + 
          '<button type="button" id="casual" value="casual" class="btn btn-default">Casual</button>' + 
          '<button type="button" id="registered" value="registered" class="btn btn-default">Registered</button>'+ 
        '</div>'  );

  this.form.selectAll("button").on("click", function () {
    $(that.eventHandler).trigger("selectionChanged", $(this)[0].value);
    that.updateVis($(this)[0].value)
  })

}

FormVis.prototype.updateVis = function(d) {
  d = "#"+d;
  this.form.selectAll("button").attr("class","btn btn-default");
  this.form.select(d).attr("class","btn btn-default active");
}