var canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: 1500, height: 600});

let polygonCounter = 0
const polygRadius = 50

canvas.on('mouse:down', function(e){
    const x = e.pointer.x
    const y = e.pointer.y

    if(e.target && e.target.type == "bond"){
      const bondOrigin = e.target.originCenter
      const x2 = e.target.left
      const y2 = e.target.top

      const polygOrigin = getPointFromOrigin(bondOrigin, {x: x2, y: y2}, polygRadius-5)//5: rad-5, 3:rad-7

      drawPolyg(polygOrigin.x, polygOrigin.y, 5, polygRadius, polygOrigin.angle +180) //5:angle+180 / 3:angle+90

    }else if (e.target && e.target.type == "circle"){
      canvas.renderAll();
      const x = e.target.left
      const y = e.target.top
      const point = getPointFromOrigin(e.target.originCenter, {x, y}, 50)
      const x2 = point.x
      const y2 = point.y
      const lineAngle = point.angle

      //add a simple bond
      drawLine(x, y, x2, y2)
      //add a circle on the edge of the bond
      const circle = new fabric.Circle({
        originCenter: {x, y},
        type: "bond",
        left: x2,
        top: y2,
        radius: 5,
        fill: "#56519f00",
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false
      });

      canvas.add(circle).requestRenderAll()

  }else if(e.target && e.target.type == "line"){

      const p1 = {x: e.target.x1, y: e.target.y1}
      const p2 = {x: e.target.x2, y: e.target.y2}
      //coord of the new point 1
      const x1 = getPointFromOrigin(e.target.originCenter, {x: p1.x, y: p1.y}, -10).x 
      const y1 = getPointFromOrigin(e.target.originCenter, {x: p1.x, y: p1.y}, -10).y
      //coord of the new point 2
      const x2 = getPointFromOrigin(e.target.originCenter, {x: p2.x, y: p2.y}, -10).x 
      const y2 = getPointFromOrigin(e.target.originCenter, {x: p2.x, y: p2.y}, -10).y

      drawLine(x1, y1, x2, y2)

  }else{
      drawPolyg(x, y, 4, polygRadius)
    }

})

//parallel line equation
const getPointFromOrigin = (origin, point, distance) => {
  const x = point.x
  const y = point.y
  const originX = origin.x
  const originY = origin.y

  const deltaX = x - originX
  const deltaY = y - originY

  let angle = Math.atan2(deltaY, deltaX)// radian

  const x2 = x + distance * Math.cos(angle)
  const y2 = y + distance * Math.sin(angle)

  angle = ( angle * 180 / Math.PI ) + 90; //transform to degree; +90 to adapt to our origin

  return {x: x2, y: y2, angle: angle}
}

//get the polygon centroid
const getPolygCentroid = (pts) => {
  let first = pts[0], last = pts[pts.length-1];
  if (first.left != last.left || first.top != last.top) pts.push(first);
  let twicearea=0,
  x=0, y=0,
  nPts = pts.length,
  p1, p2, f;
  for ( let i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
     p1 = pts[i]; p2 = pts[j];
     f = p1.left*p2.top - p2.left*p1.top;
     twicearea += f;          
     x += ( p1.left + p2.left ) * f;
     y += ( p1.top + p2.top ) * f;
  }
  f = twicearea * 3;
  return { x:x/f, y:y/f };
}

const drawPolyg = (x, y, nbrSides, radius, rot = 0) =>{
    const points = regularPolygonPoints(nbrSides, radius)

    switch (nbrSides) {
      case 6:
        rot += 30
        break;
      case 5:
        rot += 270
        break;
      case 4:
        rot += 45
        break;
    
      default:
        break;
    }

    const polyg = new fabric.Polygon(points, {
        id: polygonCounter++,
        type: "polygone",
        top: y,
        left: x,
        fill: '',
        stroke: 'black',
        strokeWidth: 3,
        originX: "center",
        originY: "center",
        angle: rot,
        hasControls: false,
        hasBorders: false,
        selectable: false
    });


    let polygPoints = addCircles(polyg)

    
    let centroid = getPolygCentroid(polygPoints)
  
    polyg['center'] = centroid

    let circles = addCircles(polyg)

    drawPolyByLine(circles)

    /* let group = new fabric.Group([ polyg, ...circles], {
        type: "group",
        left: x,
        top: y,
        originX: "center",
        originY: "center",
      });
      canvas.add(group).requestRenderAll(); */

    /*polyg.on("modified", function () {
        circles = addCircles(this)
        console.log(canvas.getObjects('circle'))
    }); */

    canvas.add(...circles).requestRenderAll();
    
}

const drawPolyByLine = (circles) => {
    circles.forEach((c, index) => {
        if (index == circles.length -1){
            drawLine(c.left, c.top, circles[0].left, circles[0].top, c.originCenter)
        }
        else
        drawLine(c.left, c.top, circles[index+1].left, circles[index+1].top, c.originCenter)
    });
}

const addCircles = (polygon)=>{
    var matrix = polygon.calcTransformMatrix();
        var transformedPoints = polygon.get("points")
          .map(function(p){
            return new fabric.Point(
               p.x - polygon.pathOffset.x,
               p.y - polygon.pathOffset.y);
          })
        .map(function(p){
          return fabric.util.transformPoint(p, matrix);
        });
        var circles = transformedPoints.map(function(p){
          return new fabric.Circle({
            polygon: polygon.id,
            originCenter: {x: polygon.center.x, y: polygon.center.y},
            type: "circle",
            left: p.x,
            top: p.y,
            radius: 5,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
          });
        });
        
    //canvas.clear().add(polygon).add.apply(canvas, circles).setActiveObject(polygon).requestRenderAll();
    //polygon.canvas.remove(...polygon.canvas.getObjects('circle')).add.apply(polygon.canvas, circles).setActiveObject(polygon).renderAll();

    return circles;
}

const drawLine = (x1, y1, x2, y2, origin = false) => {
    const line = new fabric.Line([x1, y1, x2, y2], {
        type: "line",
        stroke: 'black',
        strokeWidth: 2,
        originCenter: {x: origin.x, y: origin.y},
        hasControls: false,
        hasBorders: false,
        selectable: false
    });

    canvas.add(line).requestRenderAll()
}

const regularPolygonPoints = (sideCount,radius) => {
    var sweep=Math.PI*2/sideCount;
    var cx=radius;
    var cy=radius;
    var points=[];
    for(var i=0;i<sideCount;i++){
        var x=cx+radius*Math.cos(i*sweep);
        var y=cy+radius*Math.sin(i*sweep);
        points.push({x:x,y:y});
    }
    return(points);
}



















//another method
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    // This function converts polar coordinates to cartesian coordinates
  
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
function getRegularPolygonPath(x,y, radius, numVertexes){
    // This function returns a path for a regular polygon centered at x,y with a radius specified with numVertexes sides
  
    var interiorAngle = 360/numVertexes;
  
    // rotationAdjustment rotates the path by 1/2 the interior angle so that the polygon always has a flat side on the bottom
    // This isn't strictly necessary, but it's how we tend to think of and expect polygons to be drawn
    var rotationAdjustment = 0;
    if (numVertexes % 2 == 0){
      rotationAdjustment = interiorAngle/2;
    }
  
    var d = [];
    for (var i=0; i<numVertexes; i++){
      // var coord = coordList[i];
      var coord = polarToCartesian(x, y, radius, i*interiorAngle + rotationAdjustment);
  
      if (i==0){
        d.push('M ');
  
        // If an odd number of vertexes, add an additional point at the top of the polygon-- this will shift the calculated center
        // point of the shape so that the centerpoint of the polygon is at x,y (otherwise the center is mis-located)
        if (numVertexes %2 == 1){
          d.push(0);
          d.push(radius);
        }
  
        d.push('M');
  
      } else {
        d.push(" L ");
      }
  
      d.push(coord.x);
      d.push(coord.y);
    }
  
    d.join(" ");
  
    d+= " Z";
  
    return d;
  
  }

const regPolygon = (x, y, radius, sides) =>{
    var pathStr = getRegularPolygonPath(x, y, radius, sides);

    var polygon = new fabric.Path(pathStr,
    {
      stroke: 'black',
      strokeWidth: 1,
      fill: 'blue',
      originX: 'center',
      originY: 'center',
    });

    // draws an octagon in this case
    canvas.add(polygon);
}