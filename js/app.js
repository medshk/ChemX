//Polygone: class
class Polygone{
    constructor(x, y, nbrSides, radius, rotation=0){
        this.x = x;
        this.y = y;
        this.nbrSides = nbrSides;
        this.radius = radius;
        this.rotation = rotation;
        this.atoms = [];
        this.bonds = [];
        this.element = null;
        this.draw();
    }

    draw(){
        const points = this.regularPolygonPoints(this.nbrSides, this.radius)

        switch (this.nbrSides) {
        case 6:
            this.rotation += 30
            break;
        case 5:
            this.rotation += 270
            break;
        case 4:
            this.rotation += 45
            break;
        
        default:
            break;
        }

        this.element = new fabric.Polygon(points, {
            //id: polygonCounter++,
            type: "polygone",
            top: this.y,
            left: this.x,
            fill: '',
            stroke: 'black',
            strokeWidth: 3,
            originX: "center",
            originY: "center",
            angle: this.rotation,
            hasControls: false,
            hasBorders: false,
            selectable: false
        });


        let polygPoints = this.addCircles(this.element)
        
        let centroid = this.getPolygCentroid(polygPoints)
    
        this.element['center'] = centroid

        let circles = this.addCircles(this.element)

        this.drawPolygByLine(circles)

        canvas.add(...circles).requestRenderAll();
    }

    regularPolygonPoints = (sideCount, radius) => {
        const sweep=Math.PI*2/sideCount;
        const cx=radius;
        const cy=radius;
        const points=[];
        for(let i=0;i<sideCount;i++){
            const x=cx+radius*Math.cos(i*sweep);
            const y=cy+radius*Math.sin(i*sweep);
            points.push({x:x,y:y});
        }
        return(points);
    }

    drawPolygByLine(circles){
        circles.forEach((c, index) => {
            if (index == circles.length -1){
                Polygone.drawLine(c.left, c.top, circles[0].left, circles[0].top, c.originCenter)
            }
            else
            Polygone.drawLine(c.left, c.top, circles[index+1].left, circles[index+1].top, c.originCenter)
        });
    }
   
    getPolygCentroid(pts){
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

    addCircles(polygone){
        let matrix = polygone.calcTransformMatrix();
        let transformedPoints = polygone.get("points")
        .map(function(p){
            return new fabric.Point(
                p.x - polygone.pathOffset.x,
               p.y - polygone.pathOffset.y);
          })
          .map(function(p){
          return fabric.util.transformPoint(p, matrix);
        });
        let circles = transformedPoints.map(function(p){
            const atom = new Atom(polygone, p.x, p.y)
            return atom.element
        });
        
    //canvas.clear().add(polygon).add.apply(canvas, circles).setActiveObject(polygon).requestRenderAll();
    //polygon.canvas.remove(...polygon.canvas.getObjects('circle')).add.apply(polygon.canvas, circles).setActiveObject(polygon).renderAll();

    return circles;
    }
    
    static getPointFromOrigin (origin, point, distance){
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

    static drawLine(x1, y1, x2, y2, origin = false){
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
}

//Atom class: represents the polygone corners
class Atom{
    constructor(polygone, x, y){
        this.polygone = polygone;
        this.x = x;
        this.y = y;
        this.element = null;
        this.draw();
    }

    draw(){
        this.element = new fabric.Circle({
            polygon: this.polygone.id,
            originCenter: {x: this.polygone.center.x, y: this.polygone.center.y},
            type: "circle",
            left: this.x,
            top: this.y,
            radius: 12,
            fill: "#56519f00", //#56519f00
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
    }

    static setBorderColor(circle, color = "blue"){
        circle.set("stroke", color);
        canvas.requestRenderAll()
    }

    static setBorderColorToDefault(circle){
        Atom.setBorderColor(circle, "#56519f00")
    }
}

//class Bond
class SimpleBond{
    constructor(point1, point2, isAddCircle = true){
        this.point1 = point1;
        this.point2 = point2;
        this.origin = origin;
        this.isAddCircle = isAddCircle;
        this.draw();
    }

    draw(){
        Polygone.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    addCircle(){
        const circle = new fabric.Circle({
            originCenter: this.point1,
            type: "bond",
            left: this.point2.x,
            top: this.point2.y,
            radius: 12,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
    
        canvas.add(circle).requestRenderAll()
    }
}


//set the fabric canvas
const canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: 1500, height: 600});

//polygone radius
const polygRadius = 50

//EVENT: click
canvas.on('mouse:down', function(e){
    const x = e.pointer.x
    const y = e.pointer.y

    if (e.target && e.target.type == "circle"){
        //canvas.renderAll();
        const x = e.target.left
        const y = e.target.top
        const point = Polygone.getPointFromOrigin(e.target.originCenter, {x, y}, 50)
        const x2 = point.x
        const y2 = point.y
        const lineAngle = point.angle
  
        //add a simple bond
        return new SimpleBond({x: x, y: y}, {x: x2, y: y2})
  
    }else if(e.target && e.target.type == "line"){

        const p1 = {x: e.target.x1, y: e.target.y1}
        const p2 = {x: e.target.x2, y: e.target.y2}
        //coord of the new point 1
        const x1 = Polygone.getPointFromOrigin(e.target.originCenter, {x: p1.x, y: p1.y}, -10).x 
        const y1 = Polygone.getPointFromOrigin(e.target.originCenter, {x: p1.x, y: p1.y}, -10).y
        //coord of the new point 2
        const x2 = Polygone.getPointFromOrigin(e.target.originCenter, {x: p2.x, y: p2.y}, -10).x 
        const y2 = Polygone.getPointFromOrigin(e.target.originCenter, {x: p2.x, y: p2.y}, -10).y
  
        return new SimpleBond({x: x1, y: y1}, {x: x2, y: y2}, false)

    }else if(e.target && e.target.type == "bond"){
        const bondOrigin = e.target.originCenter
        const x2 = e.target.left
        const y2 = e.target.top
  
        const polygOrigin = Polygone.getPointFromOrigin(bondOrigin, {x: x2, y: y2}, polygRadius-5)//5: rad-5, 3:rad-7
  
        return new Polygone(polygOrigin.x, polygOrigin.y, 5, polygRadius, polygOrigin.angle +180) //5:angle+180 / 3:angle+90
  
      }else{
        return new Polygone(x, y, 6, polygRadius)
    }

});

//EVENT: hover
canvas.on('mouse:over', function(e){
    if (e.target && (e.target.type == "circle" || e.target.type == "bond")){
        const circle = e.target;
        Atom.setBorderColor(circle)
    }
})

canvas.on('mouse:out', function(e){
    if (e.target && (e.target.type == "circle" || e.target.type == "bond") ){
        const circle = e.target;
        Atom.setBorderColorToDefault(circle)
    }
    //Atom.setBorderColorToDefault()
})