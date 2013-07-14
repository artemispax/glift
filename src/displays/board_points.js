(function() {
// TODO(kashomon): Add much better tests for these methods.  The BoardPoints are
// pivotal to creating the go board, so we want them to really work.

/**
 * Simple wrapper around the BoardPoints constructor.
 */
glift.displays.boardPoints = function(points, spacing, maxIntersects) {
  return new BoardPoints(points, spacing, maxIntersects);
};

/**
 * Construct the board points from a linebox (see linebox.js).
 *
 * TODO(kashomon): This is pretty irritating to test.  Is there an easier way to
 * structure this?
 */
glift.displays.boardPointsFromLineBox = function(linebox, maxIntersects) {
  var spacing = linebox.spacing,
      radius = spacing / 2,
      linebbox = linebox.bbox,
      left = linebbox.left() + linebox.extensionBox.left() * spacing,
      top = linebbox.top() + linebox.extensionBox.top() * spacing,
      leftPt = linebox.pointTopLeft.x(),
      topPt = linebox.pointTopLeft.y(),
      // Mapping from int point hash, e.g., (0,18), to coordinate data.
      points = {};

  for (var i = 0; i <= linebox.xPoints; i++) {
    for (var j = 0; j <= linebox.yPoints; j++) {
      var xCoord = left + i * spacing;
      var yCoord = top + j * spacing;
      var intPt = glift.util.point(leftPt + j, topPt + i);
      var coordPt = glift.util.point(xCoord, yCoord);
      points[intPt.hash()] = {
        // Integer point.
        intPt: intPt,
        coordPt: coordPt,
        bbox: glift.displays.bboxFromPts(
            glift.util.point(coordPt.x() - radius, coordPt.y() - radius),
            glift.util.point(coordPt.x() + radius, coordPt.y() + radius))
      };
    }
  }
  return glift.displays.boardPoints(points, spacing, maxIntersects);
};

/**
 * BoardPoints maintains a mapping from an intersection on the board
 * to a coordinate in pixel-space. It also contains information about the
 * spcaing of the points and the radius (useful for drawing circles).
 *
 * Later, this is directly to create everything that lives on an intersection.
 * In particular,
 *  - lines
 *  - star ponts
 *  - marks
 *  - stones
 *  - stone shadows
 *  - button bounding box.
 *
 *  Note: The integer points are 0 Indexed.
 */
var BoardPoints = function(points, spacing, maxIntersects) {
  this.points = points; // int hash is 0 indexed, i.e., 0->18.
  this.spacing = spacing;
  this.radius = spacing / 2;
  this.intersections = maxIntersects;
};

BoardPoints.prototype = {
  /**
   * Get the points.
   *
   * TODO(kashomon): Remove?  I don't think this is necessary any longer.
   */
  getCoords: function() {
    return this.points;
  },

  /**
   * Get the coordinate for a given integer point string.  Note: the integer
   * points are 0 indexed, i.e., 0->18.
   *
   * Ex. :  (0,2) =>
   * {
   *  intPt: (0,2),
   *  x: 12.32,
   *  y: 54.54,
   *  ...
   * }
   */
  getCoord: function(pt) {
    return this.points[pt.hash()];
  },

  /**
   * Traverse over all the points. The order in which the points are traversed
   * is not guaranteed.
   */
  forEach: function(func) {
    for (var key in this.points) {
      func(this.points[key]);
    }
  },

  /**
   * Return the points as an array.  This is useful for D3, in particular.
   */
  data: function() {
    var data = [];
    this.forEach(function(point) {
      data.push(point);
    });
    return data;
  },

  /**
   * Test whether a point exists in the points map.
   */
  hasCoord: function(pt) {
    return this.points[pt.hash()] !== undefined;
  },

  /**
   * Draw a circle for every intersection, for debug purposes.
   *
   * TODO(kashomon): This is raphael-specific and should be removed, or changed
   * to use D3.
   */
  _debugDraw: function(paper, color) {
    for (var ptHash in this.points) {
      var centerX = this.points[ptHash].bbox.center().x();
      var centerY = this.points[ptHash].bbox.center().y();
      var circ = paper.circle(centerX, centerY, this.radius);
      circ.attr({fill:color, opacity:.3});
    }
  }
};

})();
