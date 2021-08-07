//Polygone: class
class Polygone{
    static sideLength = 30;
    static radius = null;
    static polygId = 1;

    constructor(x, y, type, rotation=0){
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = rotation;
        this.bonds = [];
        this.atoms = [];
        this.lines = []; //array of lines that constitute the polygone (Sides)
        this.element = null;
        this.draw(); //draw the polygone
    }


    static getNbrSides(type){
        switch (type) {
            case "benzene":
                return 6
                break;
            case "butane":
                return 4
                break;
            case "cyclopentadiene":
                return 5
                break;
            case "hexane":
                return 6
                break;
            case "pentane":
                return 5
                break;
            case "propane":
                return 3
                break;
        
            default:
                break;
        }
    }

    draw(){        
        switch (this.type) {
            case "benzene":
                this.drawBenzene()
                break;
            case "cyclopentadiene":
                this.drawCyclopentadiene()
                break;
        
            default:
                this.drawSimplePolygone()
                break;
        }
    }

    //Polygone method without bonds inside
    drawSimplePolygone(){
        const nbrSides = Polygone.getNbrSides(this.type)
        let radius = Polygone.radius;
        switch (nbrSides) {
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

        const points = this.regularPolygonPoints(nbrSides, radius)

        this.element = new fabric.Polygon(points, {
            id: Polygone.polygId,
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
        Canvas.drawCentroid(centroid, Polygone.polygId)
        
        let circles = this.addCircles(this.element, false)
        
        this.drawPolygByLine(circles)

        this.addSquare()

        canvas.add(...circles).requestRenderAll();

        Polygone.polygId++;
    }

    //Benzene method: hexagone(6) with bonds inside
    drawBenzene(){
        const nbrSides = Polygone.getNbrSides(this.type)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 30;

        this.element = new fabric.Polygon(points, {
            id: Polygone.polygId,
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

        //get corners coord
        let polygPoints = this.addCircles(this.element)
        
        //get the centroid
        let centroid = this.getPolygCentroid(polygPoints)
        
        //add centroid coord to polygone attributes
        this.element['center'] = centroid
        Canvas.drawCentroid(centroid, Polygone.polygId)

        //add circles
        let circles = this.addCircles(this.element, false)

        //draw polygone using lines
        this.drawPolygByLine(circles)

        //add bonds inside the polygone
        this.lines.forEach((line, index) => {
            if( [0, 2, 4].includes(index) ){
                SimpleBond.drawInsidePolyg(line)
            }
        })

        this.addSquare()
        canvas.add(...circles).requestRenderAll();
        Polygone.polygId++;
    }

    //Cyclopentadiene method: pentagone(5) with bonds inside
    drawCyclopentadiene(){
        const nbrSides = Polygone.getNbrSides(this.type)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 270;

        this.element = new fabric.Polygon(points, {
            id: Polygone.polygId,
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

        //get corners coord
        let polygPoints = this.addCircles(this.element)
        
        //get the centroid
        let centroid = this.getPolygCentroid(polygPoints)
        
        //add centroid coord to polygone attributes
        this.element['center'] = centroid
        Canvas.drawCentroid(centroid, Polygone.polygId)

        //add circles
        let circles = this.addCircles(this.element, false)

        //draw polygone using lines
        this.drawPolygByLine(circles)

        //add bonds inside the polygone
        this.lines.forEach((line, index) => {
            if( [1, 3].includes(index) ){
                SimpleBond.drawInsidePolyg(line)
            }
        })

        this.addSquare()
        canvas.add(...circles).requestRenderAll();
        Polygone.polygId++;
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
                const line = Canvas.drawLine(c.left, c.top, circles[0].left, circles[0].top, c.originCenter, undefined, c.polygId);
                this.lines.push(line)
            }
            else{
                const line = Canvas.drawLine(c.left, c.top, circles[index+1].left, circles[index+1].top, c.originCenter, undefined, c.polygId);
                this.lines.push(line)
            }
        });
    }
   
    //get the centroid coordinate of the polygone
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

    //add circles on corners
    addCircles(polygone, addAtom = true){
        const atoms = this.atoms
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
            if(addAtom){
                atoms.push(atom);
            }
            return atom.element
        });
        this.atoms = atoms;
        return circles;
    }

    //add hover on sides
    addSquare(){
        this.lines.forEach(line => {
            const point1 = {x: line.x1, y:line.y1}
            const point2 = {x: line.x2, y:line.y2}
            const midpoint = {x: (point1.x + point2.x)/2,
                            y: (point1.y + point2.y)/2, 
                            angle: Canvas.getPointFromOrigin(point1, point2, 4).angle
                            }
            //draw circle in midpoint
            const mp = new fabric.Circle({
                lineId: line.lineId,
                type: "midpoint",
                left: midpoint.x,
                top: midpoint.y,
                radius: 3,
                fill: "transparent",
                originX: 'center',
                originY: 'center',
                hasControls: false,
                hasBorders: false,
                selectable: false
            })
            //draw elipse around lines
            const square = new fabric.Rect({
                polygId: line.polygId,
                lineId: line.lineId,
                line: line,
                type: 'side',
                originCenter: this.element.center,
                center: midpoint,
                width: 16, 
                height: Polygone.sideLength + 12, 
                left: midpoint.x + 0.5, 
                top: midpoint.y + 0.5,
                rx: '5',
                ry: '5',
                fill: ' #56519f00',
                strokeWidth : 2,
                originX: 'center',
                originY: 'center',
                angle: midpoint.angle,
                hasControls: false,
                hasBorders: false,
                selectable: false
            });

            canvas.add(square, mp).requestRenderAll();
            return square;
        })
    }

    static draw2(circle, type){
        const nbrSides = Polygone.getNbrSides(type)
        let angle = 0;
        let originRadius = Polygone.radius;
        switch (nbrSides) {
            case 3:
                //radius = radius/1.5;
                originRadius -= 7;
                angle = 90;
                break;
            case 5:
                originRadius -= 4;
                angle = 180;
                break;
            case 4:
                //originRadius /= 1.5;
                angle = 45;
                break;
        
            default:
                break;
        }
        const bondOrigin = circle.originCenter
        const x2 = circle.left
        const y2 = circle.top
  
        const polygOrigin = Canvas.getPointFromOrigin(bondOrigin, {x: x2, y: y2}, originRadius)//5: rad-5, 3:rad-7
  
        return new Polygone(polygOrigin.x, polygOrigin.y, type, polygOrigin.angle + angle) //5:angle+180 / 3:angle+90
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
            polygId: this.polygone.id,
            originCenter: {x: this.polygone.center.x, y: this.polygone.center.y},
            type: "circle",
            left: this.x,
            top: this.y,
            radius: 10,
            strokeWidth: 2,
            fill: "#56519f00", //#56519f00
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
    }
}

//class Bond
class SimpleBond{
    constructor(point1, point2, polygId, isAddCircle = true){
        this.point1 = point1;
        this.point2 = point2;
        this.origin = origin;
        this.polygId = polygId;
        this.circle = null;
        this.isAddCircle = isAddCircle;
        this.draw();
    }

    static length = Polygone.sideLength;

    draw(){
        Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y, this.point1.origin, undefined, this.polygId)
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    //add circles on corners
    addCircle(){
        const circle = new fabric.Circle({
            polygId: this.polygId,
            originCenter: this.point1.origin,
            type: "bond",
            left: this.point2.x,
            top: this.point2.y,
            radius: 10,
            strokeWidth: 2,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        
        this.circle = circle;
        canvas.add(circle).requestRenderAll()

    }

    static drawInsidePolyg (line){
        //always get the current coords even after moving
        let x1 = line.left - (line.x2 - line.x1)/2;
        let y1 = line.top - (line.y2 - line.y1)/2;
        let x2 = line.left + (line.x2 - line.x1)/2;
        let y2 = line.top + (line.y2 - line.y1)/2;
        const p1 = {x: x1, y: y1}
        const p2 = {x: x2, y: y2}
        //coord of the new point 1
        x1 = Canvas.getPointFromOrigin(line.originCenter, {x: p1.x, y: p1.y}, -10).x 
        y1 = Canvas.getPointFromOrigin(line.originCenter, {x: p1.x, y: p1.y}, -10).y
        //coord of the new point 2
        x2 = Canvas.getPointFromOrigin(line.originCenter, {x: p2.x, y: p2.y}, -10).x 
        y2 = Canvas.getPointFromOrigin(line.originCenter, {x: p2.x, y: p2.y}, -10).y
  
        return new SimpleBond({x: x1, y: y1}, {x: x2, y: y2}, undefined, false)
    }

    static drawOutsidePolyg (circle){
        const x = circle.left
        const y = circle.top
        const point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, SimpleBond.length)
        const x2 = point.x
        const y2 = point.y
        //const lineAngle = point.angle
  
        //add a simple bond
        return new SimpleBond({x: x, y: y, origin: circle.originCenter}, {x: x2, y: y2}, circle.polygId)
    }
}

//BoldBond class
class BoldBond extends SimpleBond{
    constructor(point1, point2, polygId) {
        super(point1, point2, polygId)
    }

    draw(){
        Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y, this.point1.origin, 4, this.polygId)
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    static drawOutsidePolyg (circle){
        const x = circle.left
        const y = circle.top
        const point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, SimpleBond.length)
        const x2 = point.x
        const y2 = point.y
        //const lineAngle = point.angle
  
        //add a simple bond
        return new BoldBond({x: x, y: y,  origin: circle.originCenter}, {x: x2, y: y2}, circle.polygId)
    }
}

//Dashed Bond class
class DashedBond extends SimpleBond{
    constructor(point1, point2, polygId) {
        super(point1, point2, polygId)
    }

    draw(){
        const line = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            polygId: this.polygId,
            strokeDashArray: [5, 3],
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
            stroke: 'black',
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        canvas.add(line).requestRenderAll()
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    static drawOutsidePolyg (circle){
        const x = circle.left
        const y = circle.top
        const point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, SimpleBond.length)
        const x2 = point.x
        const y2 = point.y
  
        //add a simple bond
        return new DashedBond({x: x, y: y, origin:circle.originCenter}, {x: x2, y: y2}, circle.polygId)
    }
}

//Hashed Bond class
class HashedBond extends SimpleBond{
    constructor(point1, point2, polygId) {
        super(point1, point2, polygId)
    }

    draw(){
        const line = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            polygId: this.polygId,
            strokeDashArray: [2, 3],
            strokeWidth: 4,
            originX: 'center',
            originY: 'center',
            stroke: 'black',
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        canvas.add(line).requestRenderAll()
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    static drawOutsidePolyg (circle){
        const x = circle.left
        const y = circle.top
        const point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, SimpleBond.length)
        const x2 = point.x
        const y2 = point.y
        //const lineAngle = point.angle
  
        //add a simple bond
        return new HashedBond({x: x, y: y, origin: circle.originCenter}, {x: x2, y: y2}, circle.polygId)
    }
}

//Double bond class
class DoubleBond{
    constructor(point1, point2, point3, point4, polygId) {
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.point4 = point4;
        this.polygId = polygId;
        this.circle = null;
        this.line1 = null;
        this.line2 = null;
        this.draw()
    }

    draw(){
        const points = this.getLinesPoints();

        let x1 =points.point1.x
        let y1 =points.point1.y
        let x2 =points.point3.x
        let y2 =points.point3.y
        //line 1
        const line1 = new fabric.Line([x1, y1, x2, y2], {
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
            stroke: 'black',
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        this.line1 = line1;


        x1 =points.point2.x
        y1 =points.point2.y
        x2 =points.point4.x
        y2 =points.point4.y  
        //line 2
        const line2 = new fabric.Line([x1, y1, x2, y2], {
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        this.line2 = line2

        let group = new fabric.Group([line1, line2],{
            type: "bond_group",
            polygId: this.polygId
        })
        
        
        canvas.add(group).requestRenderAll()
        this.addCircle()
        
    }

    //get points for parallel lines
    getLinesPoints(){
        const line1 = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            strokeWidth: 1,
            angle: 90,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        //canvas.add(line1).requestRenderAll()

        const point1 = this.getNewPoints(line1).point1;
        const point2 = this.getNewPoints(line1).point2;

        const line2 = new fabric.Line([this.point3.x, this.point3.y, this.point4.x, this.point4.y], {
            strokeWidth: 1,
            angle: 90,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        //canvas.add(line2).requestRenderAll()

        const point3 = this.getNewPoints(line2).point1;
        const point4 = this.getNewPoints(line2).point2

        return{point1, point2, point3, point4}
    }

    //calc line points after rotation
    getNewPoints(line){
        const points = line.calcLinePoints();
        const matrix = line.calcTransformMatrix();
        const point1 = fabric.util.transformPoint({ x: points.x1, y: points.y1 }, matrix);
        const point2 = fabric.util.transformPoint({ x: points.x2, y: points.y2 }, matrix);

        return{point1, point2}
    }

    //add circles on corners
    addCircle(){
        //midpoint of both lines start points
        const originCenter = {x: (this.line1.x1 + this.line2.x1)/2,
                            y: (this.line1.y1 + this.line2.y1)/2};

        //midpoint of both lines end points
        const coord = {x: (this.line1.x2 + this.line2.x2)/2,
            y: (this.line1.y2 + this.line2.y2)/2};

        const circle = new fabric.Circle({
            polygId: this.polygId,
            originCenter: originCenter,
            type: "bond",
            left: coord.x,
            top: coord.y,
            radius: 10,
            strokeWidth: 2,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        
        this.circle = circle;
        canvas.add(circle).requestRenderAll()

    }

    static drawOutsidePolyg (circle){
        //get a point 2px below the corner point so the midpoint of the line {x,y,x2,y2} matches exactly with the cotner (useful when we apply the rotation on the line)
        let point = Canvas.getPointFromOrigin(circle.originCenter, {x:circle.left, y:circle.top}, -2)
        const x = point.x
        const y = point.y
        point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, 4)
        const x2 = point.x
        const y2 = point.y

        point = Canvas.getPointFromOrigin({x, y}, {x:x2, y:y2}, Polygone.sideLength - 4)
        const x3 = point.x
        const y3 = point.y
        point = Canvas.getPointFromOrigin({x:x2, y:y2}, {x:x3, y:y3}, 4)
        const x4 = point.x
        const y4 = point.y

        //add a simple bond
        return new DoubleBond({x: x, y: y}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}, circle.polygId)
    }
}

//Hashed Wedged Bond class
class HashedWedgedBond{
    constructor(points, polygId) {
        this.points = points;
        this.polygId = polygId;
        this.circle = null;
        this.draw()
    }

    draw(){
        const lines = []
        this.points.forEach((point) => {
            const x1 = point.p1.x
            const y1 = point.p1.y
            const x2 = point.p2.x
            const y2 = point.p2.y
            const line = new fabric.Line([x1, y1, x2, y2], {
                stroke: 'black',
                strokeWidth: 2,
                evented: false,
                originX: 'center',
                originY: 'center',
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
            lines.push(line)
        });

        const group = new fabric.Group([...lines],{
            type: "bond_group",
            polygId: this.polygId
        })
        canvas.add(group).requestRenderAll()
        this.addCircle()
    }

    //add circles on corners
    addCircle(){
        //midpoint of both lines start points
        const lastLine = this.points[this.points.length - 1]
        const originCenter = {x: (lastLine.p1.x + lastLine.p2.x)/2,
            y: (lastLine.p1.y + lastLine.p2.y)/2}; 

        //midpoint of both lines end points
        const firstLine = this.points[0]
        const coord = {x: (firstLine.p1.x + firstLine.p2.x)/2,
            y: (firstLine.p1.y + firstLine.p2.y)/2}; 

        const circle = new fabric.Circle({
            polygId: this.polygId,
            originCenter: originCenter,
            type: "bond",
            left: coord.x,
            top: coord.y,
            radius: 10,
            strokeWidth: 2,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        
        this.circle = circle;
        canvas.add(circle).requestRenderAll()

    }

    static getNewPoints(line){
        const points = line.calcLinePoints();
        const matrix = line.calcTransformMatrix();
        const point1 = fabric.util.transformPoint({ x: points.x1, y: points.y1 }, matrix);
        const point2 = fabric.util.transformPoint({ x: points.x2, y: points.y2 }, matrix);

        return{point1, point2}
    }

    static drawOutsidePolyg (circle){
        let point = Canvas.getPointFromOrigin(circle.originCenter, {x:circle.left, y:circle.top}, Polygone.sideLength - 4)
        const x1 = point.x
        const y1 = point.y
        point = Canvas.getPointFromOrigin({x:circle.left, y:circle.top}, {x:x1, y:y1}, 8 )
        const x2 = point.x
        const y2 = point.y

        const line = new fabric.Line([x1, y1, x2, y2], {
            strokeWidth: 2,
            angle: 90,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        //canvas.add(line).requestRenderAll()

        //new line points after rotation
        const points = HashedWedgedBond.getNewPoints(line);
        const point1 = points.point1
        const point2 = points.point2

        const bondPoints = []
        for(let i = 0 ; i > -Polygone.sideLength; i-=5){
            let p1 = Canvas.getPointFromOrigin({x:circle.left, y:circle.top}, {x:point1.x, y:point1.y}, i)
            let p2 = Canvas.getPointFromOrigin({x:circle.left, y:circle.top}, {x:point2.x, y:point2.y}, i)

            bondPoints.push({p1, p2})
        }

        return new HashedWedgedBond(bondPoints, circle.polygId)
    }
}

//wedged bond class
class WedgedBond{
    constructor(points, polygId) {
        this.points = points;
        this.polygId = polygId;
        this.circle = null;
        this.draw()
    }

    draw(){
        const triangle = new fabric.Polygon(this.points, {
            type:"line",
            polygId: this.polygId,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        canvas.add(triangle).requestRenderAll()
        this.addCircle()
    }

    //add circles on corners
    addCircle(){
        const originCenter =  this.points[this.points.length - 1]

        const coord = {x: (this.points[0].x + this.points[1].x)/2,
            y: (this.points[0].y + this.points[1].y)/2};

        const circle = new fabric.Circle({
            polygId: this.polygId,
            originCenter: originCenter,
            type: "bond",
            left: coord.x,
            top: coord.y,
            radius: 10,
            strokeWidth: 2,
            fill: "#56519f00",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        
        this.circle = circle;
        canvas.add(circle).requestRenderAll()

    }

    static drawOutsidePolyg (circle){
        let point = Canvas.getPointFromOrigin(circle.originCenter, {x:circle.left, y:circle.top}, Polygone.sideLength - 3)
        const x1 = point.x
        const y1 = point.y
        point = Canvas.getPointFromOrigin({x:circle.left, y:circle.top}, {x:x1, y:y1}, 6 )
        const x2 = point.x
        const y2 = point.y

        const line = new fabric.Line([x1, y1, x2, y2], {
            strokeWidth: 2,
            angle: 90,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        //canvas.add(line).requestRenderAll()

        //new line points after rotation
        const points = HashedWedgedBond.getNewPoints(line);
        const point1 = points.point1
        const point2 = points.point2
        const point3 = {x:circle.left, y:circle.top}
        const bondPoints = [point1, point2, point3]


        return new WedgedBond(bondPoints, circle.polygId)
    }
}

//wedged bond class
class HollowBond extends WedgedBond{
    constructor(points, polygId) {
        super(points, polygId)
    }

    draw(){
        const triangle = new fabric.Polygon(this.points, {
            type:"line",
            polygId: this.polygId,
            fill: '',
            stroke: 'black',
            strokeWidth: 2,
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
        canvas.add(triangle).requestRenderAll()
        this.addCircle()
    }

    static drawOutsidePolyg (circle){
        let point = Canvas.getPointFromOrigin(circle.originCenter, {x:circle.left, y:circle.top}, Polygone.sideLength - 3)
        const x1 = point.x
        const y1 = point.y
        point = Canvas.getPointFromOrigin({x:circle.left, y:circle.top}, {x:x1, y:y1}, 6 )
        const x2 = point.x
        const y2 = point.y

        const line = new fabric.Line([x1, y1, x2, y2], {
            strokeWidth: 2,
            angle: 90,
            originX: 'center',
            originY: 'center',
            stroke: 'black'
        });
        //canvas.add(line).requestRenderAll()

        //new line points after rotation
        const points = HashedWedgedBond.getNewPoints(line);
        const point1 = points.point1
        const point2 = points.point2
        const point3 = {x:circle.left, y:circle.top}
        const bondPoints = [point1, point2, point3]


        return new HollowBond(bondPoints, circle.polygId)
    }
}

//Text class
class Text{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.display()
    }

    display(){
        const text = new fabric.IText('Text', 
        {   type: "text",
            left: this.x, 
            top: this.y,
            fontSize: 42,
            strokeWidth: 4,
            cache: false,
            originX: "center",
            originY: "center",
            //hasControls: false,
            //hasBorders: false,
        });
        canvas.add(text);
    }

    static displayAtomName(circle, circleType){
        let x, y;
        switch (circleType) {
            case "circle":
                x = circle.left;
                y = circle.top;
                break;
            case "bond":
                const point = Canvas.getPointFromOrigin(circle.originCenter, {x:circle.left, y:circle.top}, 10)
                x = point.x
                y = point.y
                break;
        
            default:
                break;
        }
        const text = new fabric.IText('C', 
        {   type: "atom_name",
            left: x, 
            top: y,
            fontSize: 15,
            textBackgroundColor: "white",
            padding: '15',
            cache: false,
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        });
        canvas.add(text);
    }
}

//Arrow class:
class Arrow{
    static element = null;
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.draw();
    }
    draw(){
        let fromx = this.x1;
        let fromy = this.y1;
        let tox = this.x2;
        let toy = this.y2;

        var angle = Math.atan2(toy - fromy, tox - fromx);
    
        var headlen = 15;  // arrow head size
    
        // bring the line end back some to account for arrow head.
        tox = tox - (headlen) * Math.cos(angle);
        toy = toy - (headlen) * Math.sin(angle);
    
        // calculate the points.
        var points = [
            {
                x: fromx,  // start point
                y: fromy
            }, {
                x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
                y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
            },{
                x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
                y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
            }, {
                x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
                y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
            },{
                x: tox + (headlen) * Math.cos(angle),  // tip
                y: toy + (headlen) * Math.sin(angle)
            }, {
                x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
                y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
            }, {
                x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
            }, {
                x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
            },{
                x: fromx,
                y: fromy
            }
        ];
    
        var pline = new fabric.Polyline(points, {
            fill: 'black',
            stroke: 'black',
            opacity: 1,
            strokeWidth: 2,
            originX: 'left',
            originY: 'top',
            selectable: false,
            //hasControls: false,
            //hasBorders: false,
        });
        
        Arrow.element = pline;
        canvas.add(pline);
    
        canvas.renderAll();
    
    }
    
}

//Canvas class: handle drawing
class Canvas{
    static lineId = 1;
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

    static drawLine(x1, y1, x2, y2, origin = false, strokeWidth = 2, polygId= null){
        const angle = Canvas.getPointFromOrigin({x:x1,y:y1}, {x:x2,y:y2}, 5).angle
        const line = new fabric.Line([x1, y1, x2, y2], {
            polygId: polygId,
            lineId: Canvas.lineId++,
            type: "line",
            stroke: 'black',
            strokeWidth: strokeWidth,
            lineAngle: angle,
            evented: false,
            originCenter: {x: origin.x, y: origin.y},
            originX: 'center',
            originY: 'center',
            hasControls: false,
            hasBorders: false,
            selectable: false
        });
    
        canvas.add(line).requestRenderAll()
        return line;
    }

    //calculate the distance between 2 points
    static distance(p1, p2) {
        const x1 = p1.x
        const x2 = p2.x
        const y1 = p1.y
        const y2 = p2.y
        return Math.hypot(x2-x1, y2-y1)
    }

    //set object border color to blue on hover
    static setBorderColor(object, color = "#50aeff"){
        object.set("stroke", color);
        canvas.requestRenderAll()
    }

    //set object border color to transparent
    static setBorderColorToDefault(object){
        Canvas.setBorderColor(object, "#56519f00")
    }

    //calc polygon radius given side length
    static getRadius(nbrSides){
        const radius = Polygone.sideLength/(2 * Math.sin(Math.PI/nbrSides))
        return radius;
    }

    //calc apothem (distance between origin center and side midpoint)
    static getApothem(type){
        const nbrSides = Polygone.getNbrSides(type)
        const r = Polygone.radius * Math.cos(Math.PI / nbrSides)
        return r
    }

    //draw circle in centroid
    static drawCentroid(centroid, polygId){
        const circle = new fabric.Circle({
            type: "centroid",
            polygId: polygId,
            left: centroid.x,
            top: centroid.y,
            radius: 5,
            fill: "#21252900",
            originX: 'center',
            originY: 'center',
            hasControls: false,
            hasBorders: false,
            selectable: false
        })
        canvas.add(circle).requestRenderAll()
    }

    //get midpoint of 2 points
    static getMidpoint(point1, point2){
        return {x: (point1.x + point2.x)/2,
                y: (point1.y + point2.y)/2,
                }
    }
}

//Toolbar class:
class Toolbar{
    constructor() {
        this.tool = null;
        this.toolType = null;
        this.toolApothem = null;
    }

    static setCurrentTool(button){
        this.tool = button.getAttribute("data-name");
        this.toolType = button.getAttribute("data-type");
        if(this.tool === "polygone"){
            Polygone.radius = Canvas.getRadius(Polygone.getNbrSides(this.toolType))
            this.toolApothem = Canvas.getApothem(this.toolType)
        }
    }

    static action(target, coord=null){
        switch (this.tool) {
            case "polygone":
                if(target == "canvas"){
                    return new Polygone(coord.x, coord.y, Toolbar.toolType)
                }
                return Toolbar.polygoneAction(target)
                break;
                
            case "bond":
                return this.BondAction(target)
                break;

            case "symbole":
                console.log(this.tool)
                break;

            case "text":
                return this.textAction(target, coord)
                break;
        
            default:
                break;
        }
    }

    static polygoneAction(target){
        switch (target.type) {
            case "circle":
                const bond = SimpleBond.drawOutsidePolyg(target)
                return Polygone.draw2(bond.circle, this.toolType)
                break;

            case "side":
                let distance = this.toolApothem;
                let angle = target.line.lineAngle + 180
                if(this.toolType == "propane"){
                    distance += 4;
                } 
                else if( this.toolType == "cyclopentadiene" || this.toolType == "pentane" ){
                    distance += 1.1;
                    angle += 17.8
                }
                const point = Canvas.getPointFromOrigin(target.originCenter, target.center, distance)
                return new Polygone(point.x, point.y, Toolbar.toolType, angle);
                break;

            case "bond":
                return Polygone.draw2(target, this.toolType)
                break;
        
            default:
                break;
        }
    }

    static BondAction(target){
        if(target.type == "circle"){
            switch (Toolbar.toolType) {
                case "simple":
                    return SimpleBond.drawOutsidePolyg(target)
                    break;
                case "bold":
                    return BoldBond.drawOutsidePolyg(target)
                    break;
                case "dashed":
                    return DashedBond.drawOutsidePolyg(target)
                    break;
                case "hashed":
                    return HashedBond.drawOutsidePolyg(target)
                    break;
                case "double":
                    return DoubleBond.drawOutsidePolyg(target)
                    break;
                case "hashed-wedged":
                    return HashedWedgedBond.drawOutsidePolyg(target)
                    break;
                case "wedged":
                    return WedgedBond.drawOutsidePolyg(target)
                    break;
                case "hollow":
                    return HollowBond.drawOutsidePolyg(target)
                    break;
            
                default:
                    break;
            }
        }else if(target.type == "side"){
            return SimpleBond.drawInsidePolyg(target.line)
        }
    }

    static textAction(target, coord=null){
        if(target == "canvas"){
            return new Text(coord.x, coord.y)
        }else if(target.type == "circle" || target.type == "bond"){
           return Text.displayAtomName(target, target.type)
        }
    }

    static arrowAction(coord){
        return new Arrow(coord.x, coord.y)
    }

    static selectionAction(){
        canvas.selection = true;
        canvas.getObjects().forEach(function(element){
            element.selectable = true
        });
        canvas.on('selection:created',function(){
            if (!canvas.getActiveObject()) {                  
                 return;
            }
            if (canvas.getActiveObject().type !== 'activeSelection') {
            return;
            }
        
            canvas.getActiveObject().toGroup();
            canvas.requestRenderAll();
        })  

        //clear the selection
        canvas.on('selection:cleared',function(e)
        {             
            if (!canvas.getObjects()) {
                return;
            }
            //ungroup
            canvas.getObjects().forEach(function(element){
                const centroids = {};
                const midpoints = {};
                const lines = {};
                if(element.type == 'group')
                {
                    var items = element._objects;
                    element._restoreObjectsState();
                    canvas.remove(element);
                    //get new polygons centroid
                    for (var i = 0; i < items.length; i++) {
                        if(items[i].type === "centroid"){
                            const centroidCoords = {x: items[i].left, y: items[i].top}
                            const centroidId = items[i].polygId;
                            centroids[centroidId] = centroidCoords
                        }
                        else if(items[i].type === "midpoint"){
                            const midpointCoords = {x: items[i].left, y: items[i].top}
                            const midpointId = items[i].lineId;
                            midpoints[midpointId] = midpointCoords
                        }
                        else if(items[i].type === "line"){
                            const lineId = items[i].lineId;
                            lines[lineId] = items[i];
                        }
                    }
                    //rerender group items into the canvas
                    for (var i = 0; i < items.length; i++) {
                        if(items[i].originCenter){
                            const itemPolygId = items[i].polygId;
                            items[i].originCenter = centroids[itemPolygId]
                        }
                        if(items[i].type === "side"){
                            const lineId = items[i].lineId
                            items[i].center = midpoints[lineId]
                            items[i].line = lines[lineId]
                        }
                        canvas.add(items[i]);
                    }                                           
                    canvas.requestRenderAll();
                }
            })
        })
    }
}


////////////////////// MAIN //////////////////////


//set the fabric canvas
const canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: 1500, height: 600});
canvas.hoverCursor = 'pointer';
canvas.selection = false;

/* canvas.on('object:added',function(){
    if(!isRedoing){
        let objects = canvas._objects
        h.push(objects);
        count++;
        console.log(h)
    }
    isRedoing = false;
  });
  
  var isRedoing = false;
  var h = [];
  let count = 0;
  
  function undo(){
      console.log(canvas._objects.length)
      if(canvas._objects.length>0){
          //h.push(canvas._objects.pop());
     h[count-1].forEach(object => {
        canvas._objects.pop()
        canvas.requestRenderAll();
     })
     console.log(canvas._objects.length)
    }
  }
  function redo(){
    
    if(h.length>0){
      isRedoing = true;
     canvas.add(h.pop());
     canvas.requestRenderAll();

    }
  }

  document.querySelector("#undo").addEventListener('click', undo); */

//set default tool
const toolBtn = document.querySelector('.tool.active');
Toolbar.setCurrentTool(toolBtn)

//arrow variables
let arrow = fromx = fromy = tox = toy = null;
let isDown = false;

//EVENT: canvas click
canvas.on('mouse:down', function(e){
    const x = e.pointer.x
    const y = e.pointer.y
    //text action
    if(!e.target && Toolbar.tool == "text"){
        Toolbar.action("canvas", {x, y})
    
    }
    //other tools action when click on a circle or square
    else if (e.target){
        Toolbar.action(e.target)

    }
    //Arrow action
    else if(Toolbar.tool == "arrow"){
        isDown = true;
        fromx = x;
        fromy = y;

    }
    //other tools action when click on void
    else if (!e.target){
        Toolbar.action("canvas", {x, y})
    }
});

//EVENT: mouse move
canvas.on("mouse:move", function(e){
    let x = e.pointer.x
    let y = e.pointer.y
    if(Toolbar.tool === "arrow" && isDown){
        tox = x;
        toy = y
        canvas.remove(Arrow.element)
        const arrow = new Arrow(fromx, fromy, tox, toy)
    }
})

canvas.on("mouse:move:before", function(e){
    if(Toolbar.tool === "arrow" && isDown){
        canvas.remove(Arrow.element)
    }
})

//EVENT:mouse up
canvas.on("mouse:up", function(e){
    isDown = false;
    if(Toolbar.tool === "arrow"){
        Arrow.element = null
    }
    saveState()
})

//EVENT: Canvas hover
canvas.on('mouse:over', function(e){
    if (e.target && (e.target.type == "circle" || e.target.type == "bond" || e.target.type == "side")){
        Canvas.setBorderColor(e.target)
    }
})

//EVENT: canvas hover out
canvas.on('mouse:out', function(e){
    if (e.target && (e.target.type == "circle" || e.target.type == "bond" || e.target.type == "side") ){
        Canvas.setBorderColorToDefault(e.target)
    }
})


//Toolbar events
document.querySelectorAll('.tool').forEach(tool => {
    tool.addEventListener('click', e => {
        e.stopPropagation();
        const btn = e.currentTarget;
        //delete active class from current tool
        document.querySelector('.tool.active').classList.remove('active');
        //add active class to the new tool
        btn.classList.add('active')
        Toolbar.setCurrentTool(btn)

        //selection tool
        if(Toolbar.tool === "selection"){
            Toolbar.selectionAction()
        }else{
            //set element selectable attribute back to false
            canvas.getObjects().forEach(function(element){
                element.selectable = false
            });
            canvas.selection = false;
        }
    })
  })

//Text editor events
//show the toolbar
document.querySelector('#text-toolbar-arrow').addEventListener('click', (e)=>{
    document.querySelector('.text-toolbar').classList.toggle("open");
    document.querySelector('#text-wrapper').classList.toggle("open");
    document.querySelector(".arrow-container").classList.toggle("open");
})

//change text color
document.getElementById('text-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({fill: this.value})
        canvas.requestRenderAll();
    }
};

//const fonts = {""}
//change font family
document.getElementById('font-family').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set("fontFamily", this.value);
        canvas.requestRenderAll();
        /* var junction_font = new FontFace('3d.demo', 'url(https://fonts.googleapis.com/css2?family=Style+Script&display=swap)');
        junction_font.load().then(function (loaded_face) 
        {
        console.log('loaded.font', loaded_face);
        document['fonts'].add(loaded_face);
        obj.set("fontFamily", '3d.demo');
        canvas.renderAll();
        }); */
    }
};

//change text align
document.getElementById('text-align').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set("textAlign", this.value);
        canvas.requestRenderAll();
    }
};

//change background color
document.getElementById('text-bg-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({backgroundColor: this.value})
        canvas.requestRenderAll();
    }
};

//change text line background color
document.getElementById('text-lines-bg-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({textBackgroundColor: this.value})
        canvas.requestRenderAll();
    }
};

//change stroke color
document.getElementById('text-stroke-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({stroke: this.value})
        canvas.requestRenderAll();
    }
};

//change stroke width
document.getElementById('text-stroke-width').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({strokeWidth: parseInt(this.value)})
        canvas.requestRenderAll();
    }
};

//change font size
document.getElementById('text-font-size').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({fontSize: parseInt(this.value)})
        canvas.requestRenderAll();
    }
};

//change line height
document.getElementById('text-line-height').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.type === "text"){
        obj.set({lineHeight: parseInt(this.value)})
        canvas.requestRenderAll();
    }
};

//text decoration
radios5 = document.getElementsByName("fonttype");  // wijzig naar button
    for(var i = 0, max = radios5.length; i < max; i++) {
        radios5[i].onclick = function() {
            
            if(document.getElementById(this.id).checked == true) {
                if(this.id == "text-cmd-bold") {
                    canvas.getActiveObject().set("fontWeight", "bold");
                }
                if(this.id == "text-cmd-italic") {
                    canvas.getActiveObject().set("fontStyle", "italic");
                }
                if(this.id == "text-cmd-underline") {
                    canvas.getActiveObject().set("underline", true);
                }
				if(this.id == "text-cmd-linethrough") {
                    canvas.getActiveObject().set("linethrough", true);
                }
				if(this.id == "text-cmd-overline") {
                    canvas.getActiveObject().set("overline", true);
                }
                
                
                
            } else {
                if(this.id == "text-cmd-bold") {
                    canvas.getActiveObject().set("fontWeight", "");
                }
                if(this.id == "text-cmd-italic") {
                    canvas.getActiveObject().set("fontStyle", "");
                }  
                if(this.id == "text-cmd-underline") {
                    canvas.getActiveObject().set("textDecoration", "");
                }
				if(this.id == "text-cmd-linethrough") {
                    canvas.getActiveObject().set("textDecoration", "");
                }  
                if(this.id == "text-cmd-overline") {
                    canvas.getActiveObject().set("textDecoration", "");
                }
            }
            
            
            canvas.renderAll();
        }
    }


//change font select options font family
Array.from(document.querySelector("#font-family").options).forEach(function(option) {
    option.style.fontFamily = `${option.value}, sans-serif`
});



const redoBtn = document.querySelector("#redo")
const undoBtn = document.querySelector("#undo")

const redoStack = []
const undoStack = []
const circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 50,
    selectable: false,
    fill: "red"
})
const circle2 = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 50,
    selectable: false,
    fill: "green"
})
canvas.add(circle, circle2).requestRenderAll();
saveState();

function saveState() {
    
    undoStack.push(JSON.stringify(canvas))
    //undoStack.push(canvas.toSVG())
    
}

function deserialize(state){
    canvas.clear();
    canvas.loadFromJSON(state, CallBack, function(o, object) {
        canvas.setActiveObject(object);
    });
    /* fabric.loadSVGFromString(state, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
      }); */
}
function CallBack() {
    canvas.renderAll();
    canvas.calcOffset();
}

function undo() {
    const state = undoStack[undoStack.length -1];
    deserialize(state)
    redoStack.push(state)
    undoStack.pop();
}

function redo() {
    const state = redoStack[redoStack.length -1];
    deserialize(state)
    undoStack.push(state)
    redoStack.pop();
}

undoBtn.addEventListener('click', undo)
redoBtn.addEventListener('click', redo)