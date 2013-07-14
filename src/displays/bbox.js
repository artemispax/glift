(function() {
glift.displays.bboxFromPts = function(topLeftPt, botRightPt) {
  return new BoundingBox(topLeftPt, botRightPt);
};

glift.displays.bboxFromDiv = function(divId) {
  var width = $('#' + divId).width();
  var height = $('#' + divId).height();
  return glift.displays.bbox(glift.util.point(0,0), width, height);
};

glift.displays.bbox = function(topLeft, width, height) {
  return new BoundingBox(
      topLeft, glift.util.point(topLeft.x() + width, topLeft.y() + height));
};

glift.displays.fromRaphaelBbox = function(rapBbox) {
  return new BoundingBox(
      glift.util.point(rapBbox.x, rapBbox.y),
      glift.util.point(rapBbox.x2, rapBbox.y2));
};

// Might be nice to use the closure to create private variables.
// A bounding box, generally for a graphical object.
var BoundingBox = function(topLeftPtIn, botRightPtIn) {
  var topLeftPt = topLeftPtIn,
      botRightPt = botRightPtIn;
  this.topLeft = function() { return topLeftPt; };
  this.botRight = function() { return botRightPt; };
  this.center = function() {
    return glift.util.point(
      glift.math.abs((botRightPt.x() - topLeftPt.x()) / 2) + topLeftPt.x(),
      glift.math.abs((botRightPt.y() - topLeftPt.y()) / 2) + topLeftPt.y());
  };
  this.width = function() { return botRightPt.x() - topLeftPt.x(); };
  this.height = function() { return botRightPt.y() - topLeftPt.y(); };
  this.top = function() { return topLeftPt.y(); };
  this.left = function() { return topLeftPt.x(); };
  this.bottom = function() { return botRightPt.y(); };
  this.right = function() { return botRightPt.x(); };
};

BoundingBox.prototype = {
  /**
   * Draw the bbox (for debugging).
   */
  draw: function(paper, color) {
    var obj = paper.rect(
        this.topLeft().x(), this.topLeft().y(), this.width(), this.height());
    obj.attr({fill:color, opacity:0.5});
  },

  /**
   * Log the points to the console (for debugging).
   */
  log: function() {
    glift.util.logz("TopLeft: " + JSON.stringify(this.topLeft()));
    glift.util.logz("BotRight: " + JSON.stringify(this.botRight()));
    glift.util.logz("Width: " + this.width());
    glift.util.logz("Height: " + this.height());
  },

  /**
   * Test to see if a point is contained in the bounding box.  Points on the
   * edge count as being contained.
   */
  contains: function(point) {
   return point.x() >= this.topLeft().x()
      && point.x() <= this.botRight().x()
      && point.y() >= this.topLeft().y()
      && point.y() <= this.botRight().y();
  },

  /**
   * Test to see if two points are equal.
   */
  equals: function(other) {
    return other.topLeft() && this.topLeft().equals(other.topLeft()) &&
        other.botRight() && this.botRight().equals(other.botRight());
  },

  /**
   * Return a new Bbox with the width and the height scaled by some fraction.
   * The TopLeft point remains the same.
   */
  fixedScale: function(amount) {
    var newHeight = this.height() * amount,
        newWidth = this.width() * amount;
    return glift.displays.bbox(this.topLeft(), newWidth, newHeight);
  },

  toString: function() {
    return this.topLeft().toString() + ',' +  this.botRight().toString();
  },

  translate: function(dx, dy) {
    return glift.displays.bboxFromPts(
        glift.util.point(this.topLeft().x() + dx, this.topLeft().y() + dy),
        glift.util.point(this.botRight().x() + dx, this.botRight().y() + dy));
  }
};

})();
