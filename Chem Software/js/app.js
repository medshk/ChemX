//Polygone: class
//name
class Polygone{
    static sideLength = 30;
    static radius = null;
    static polygId = 1;

    constructor(x, y, name, rotation=0){
        this.x = x;
        this.y = y;
        this.name = name;
        this.rotation = rotation;
        this.bonds = [];
        this.atoms = [];
        this.lines = []; //array of lines that constitute the polygone (Sides)
        this.element = null;
        this.draw(); //draw the polygone
    }


    static getNbrSides(name){
        switch (name) {
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
        switch (this.name) {
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
        const nbrSides = Polygone.getNbrSides(this.name)
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
            name: "polygone",
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
        const nbrSides = Polygone.getNbrSides(this.name)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 30;

        this.element = new fabric.Polygon(points, {
            id: Polygone.polygId,
            name: "polygone",
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
        const nbrSides = Polygone.getNbrSides(this.name)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 270;

        this.element = new fabric.Polygon(points, {
            id: Polygone.polygId,
            name: "polygone",
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
                //add line id in circles
                c.lineId.push(line.lineId);
                circles[0].lineId.push(line.lineId);
                //add circles in line
                line["circles"] = [c, circles[0]]
            }
            else{
                const line = Canvas.drawLine(c.left, c.top, circles[index+1].left, circles[index+1].top, c.originCenter, undefined, c.polygId);
                this.lines.push(line)
                //add line id in circles
                c.lineId.push(line.lineId);
                circles[index+1].lineId.push(line.lineId);
                //add circles in line
                line["circles"] = [c, circles[index+1]]
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
                name: "midpoint",
                left: midpoint.x,
                top: midpoint.y,
                radius: 3,
                fill: "transparent",
                originX: 'center',
                evented: false,
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
                name: 'side',
                originCenter: this.element.center,
                center: midpoint,
                width: 12, 
                height: Polygone.sideLength + 12, 
                left: midpoint.x + 0.5, 
                top: midpoint.y + 0.5,
                rx: '5',
                ry: '5',
                fill: 'transparent',
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

    static draw2(circle, name){
        const nbrSides = Polygone.getNbrSides(name)
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
  
        return new Polygone(polygOrigin.x, polygOrigin.y, name, polygOrigin.angle + angle) //5:angle+180 / 3:angle+90
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
            lineId: [],
            originCenter: {x: this.polygone.center.x, y: this.polygone.center.y},
            name: "circle",
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
        this.bondId = null;
        this.draw();
    }

    static length = Polygone.sideLength;

    draw(){
        const line = Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y, this.point1.origin, undefined, this.polygId)
        line.name = "_bond";
        this.bondId = line.lineId;
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    //add circles on corners
    addCircle(){
        const circle = new fabric.Circle({
            lineId: this.bondId,
            polygId: this.polygId,
            originCenter: this.point1.origin,
            name: "bond",
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
        this.bondId = null;
    }

    draw(){
        const line = Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y, this.point1.origin, 4, this.polygId)
        line.name = "_bond";
        this.bondId = line.lineId;
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
        this.bondId = null;
    }

    draw(){
        this.bondId = Canvas.lineId++;
        const line = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            polygId: this.polygId,
            lineId: this.bondId,
            name: "_bond",
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
        this.bondId = null;
    }

    draw(){
        this.bondId = Canvas.lineId++;
        const line = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            polygId: this.polygId,
            lineId: this.bondId,
            name: "_bond",
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
        this.bondId = Canvas.lineId++;
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
            name: "_bond",
            polygId: this.polygId,
            lineId: this.bondId,
            hasControls: false,
            hasBorders: false,
            selectable: false
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
            lineId: this.bondId,
            originCenter: originCenter,
            name: "bond",
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
        this.bondId = Canvas.lineId++;
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
            name: "_bond",
            polygId: this.polygId,
            lineId: this.bondId,
            hasControls: false,
            hasBorders: false,
            selectable: false
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
            lineId: this.bondId,
            originCenter: originCenter,
            name: "bond",
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
        this.bondId = Canvas.lineId++;
        this.draw()
    }

    draw(){
        const triangle = new fabric.Polygon(this.points, {
            name: "_bond",
            polygId: this.polygId,
            lineId: this.bondId,
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
            lineId: this.bondId,
            originCenter: originCenter,
            name: "bond",
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
        this.bondId = Canvas.lineId++;
    }

    draw(){
        const triangle = new fabric.Polygon(this.points, {
            name: "_bond",
            polygId: this.polygId,
            lineId: this.bondId, 
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
        {   name: "text",
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
        {   name: "atom_name",
            left: x, 
            top: y,
            fontSize: 15,
            textBackgroundColor: "white",
            strokeWidth: 15,
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

//Eraser class
class Eraser{
    constructor(object){
        this.object = object;
        this.erase()
    }
    erase(){
        if(this.object.name == "side"){
            console.log(this.object)
            const line = this.object.line;
            const circle1 = line.circles[0]
            const circle2 = line.circles[1]

            //remove line midpoint object
            const lineMidPoint = canvas.getObjects().filter(o => o.name == "midpoint" && o.lineId == line.lineId)[0]
            canvas.remove(lineMidPoint)
            //check if circle has 1 line only then remove the circle
            if(circle1.lineId.length === 1 || circle2.lineId.length === 1){
                if(circle1.lineId.length === 1){
                    canvas.remove(circle1)
                }if(circle2.lineId.length === 1){
                    canvas.remove(circle2)
                }
            //if not then remove the lineId of the removed line from the circles
            }else{
                circle1.lineId = circle1.lineId.filter(l => l !== line.lineId);
                circle2.lineId = circle2.lineId.filter(l => l !== line.lineId);
            }
            canvas.remove(this.object.line, this.object)

        }else if(this.object.name !== "circle"){
            canvas.remove(this.object)
            //delete bond circle
            if(this.object.name == "_bond"){
                const bond = canvas.getObjects().filter(o => o.name == "bond" && o.lineId == this.object.lineId)[0]
                canvas.remove(bond)
            }
        }
        console.log(this.object)
    }
}

//class Symbol
class Symbol{
    constructor(object, symbol){
        this.object = object //object to add on the symbol
        this.symbol = symbol //the symbol itself
    }
    draw(){
        if(this.object.name == "atom_name" || this.object.name == "circle"){
            canvas.add(this.symbol).requestRenderAll()
        }
    }
}

class Plus extends Symbol{
    constructor(object){
        super(object)
        this.symbol = null;
        this.setSymbol()
        this.draw()
    }
    setSymbol(){
        this.symbol = new fabric.IText("+",{
            left: this.object.left + 10,
            top: this.object.top - 5,
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: "white",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })
    }
}

class Minus extends Symbol{
    constructor(object){
        super(object)
        this.symbol = null;
        this.setSymbol()
        this.draw()
    }
    setSymbol(){
        this.symbol = new fabric.IText("-",{
            left: this.object.left + 10,
            top: this.object.top - 5,
            fontSize: 20,
            fontWeight: "bold",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })
    }
}

class CirclePlus extends Symbol{
    constructor(object){
        super(object)
        this.symbol = null;
        this.setSymbol()
        this.draw()
    }
    setSymbol(){
        const circle = new fabric.Circle({
            left: this.object.left + 13,
            top: this.object.top - 5,
            radius: 6,
            strokeWidth: 1,
            fill: "transparent",
            backgroundColor: "white",
            stroke: "black",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })

        const plus = new fabric.IText("+",{
            left: circle.left,
            top: circle.top,
            fontSize: 16,
            fontWeight: "bold",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })

        this.symbol = new fabric.Group([circle, plus],{
            name: "symbol",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        })
    }
}

class CircleMinus extends Symbol{
    constructor(object){
        super(object)
        this.symbol = null;
        this.setSymbol()
        this.draw()
    }
    setSymbol(){
        const circle = new fabric.Circle({
            left: this.object.left + 13,
            top: this.object.top - 5,
            radius: 6,
            strokeWidth: 1,
            fill: "transparent",
            backgroundColor: "white",
            stroke: "black",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })

        const minus = new fabric.IText("-",{
            left: circle.left,
            top: circle.top - 2.5,
            fontSize: 20,
            fontWeight: "bold",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
        })

        this.symbol = new fabric.Group([circle, minus],{
            name: "symbol",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: false
        })
    }
}
//class Undo and redo
class UndoRedo{
    static attributes = ['id', 'name', 'circles', 'stroke', 'strokeWidth', 'originX', 'originY', 'angle', 'hasControls', 'hasBorders', 'selectable', 'lineId', 'radius', 'polygId', 'originCenter', 'center', 'line', 'originCenter', 'strokeDashArray', 'evented', 'fontSize', 'textBackgroundColor', 'padding', 'opacity', 'lineAngle', 'rx', 'ry']

    static redoStack = []
    static undoStack = []

    static saveState() {
        //const state = canvas.toJSON(UndoRedo.attributes)
        const state = JSON.stringify(canvas.toJSON(UndoRedo.attributes))
        UndoRedo.undoStack.push(state)
        console.log("save")
    }

    static deserialize(state){
        canvas.clear();
        canvas.loadFromJSON(state, function(){
            canvas.requestRenderAll()
            UndoRedo.updateObjects()
        })

    }

    //
    static updateObjects(){
        const objects = canvas.getObjects()
        const sides = objects.filter(o => o.name == "side")
        const lines = objects.filter(o => o.name == "line")
        sides.forEach(s => {
            s.line = lines.filter(l => l.lineId == s.lineId)[0]
            const circles = objects.filter(o => o.name == "circle" && o.lineId.includes(s.lineId))
            s.line.circles = circles;
        });
        //keep sides color transparent
        const s = sides.filter(s => s.stroke !== "transparent")[0]
        if(s){
            s.stroke = "transparent"
        }
    }

    static undo() {
        const toRedo = UndoRedo.undoStack[UndoRedo.undoStack.length - 1]; //state to push into the redo stack
        const toShow = UndoRedo.undoStack[UndoRedo.undoStack.length - 2]; //state to UndoRedo.deserialize
        if(toShow){
            UndoRedo.deserialize(toShow)
            UndoRedo.redoStack.push(toRedo)
            UndoRedo.undoStack.pop();
        }
        //alwas keep selectable attrubite to true the selected tool is the selection
        if(Toolbar.tool === "selection"){
            Canvas.setSelectable(true)
        }
        //ungroup
        Canvas.ungroup()
    }

    static redo() {
        const toUndo = UndoRedo.redoStack[UndoRedo.redoStack.length - 1];
        const toShow = UndoRedo.redoStack[UndoRedo.redoStack.length - 1];
        if(toShow){
            UndoRedo.deserialize(toShow)
            UndoRedo.undoStack.push(toUndo)
            UndoRedo.redoStack.pop();
        }
        //alwas keep selectable attrubite to true the selected tool is the selection
        if(Toolbar.tool === "selection"){
            Canvas.setSelectable(true)
        }
        //ungroup
        Canvas.ungroup()
    }
}
//class New
class New{
    static currentTab(){
        window.location.reload();
    }
    static newTab(){
        window.open(window.location.href, '_blank');
    }
}
//class Document
class Document{
    //save file
    static save(){
        let save = canvas.toJSON(UndoRedo.attributes);
        var data = Document.encode( JSON.stringify(save, null, 4) );

        var blob = new Blob( [ data ], {
            type: 'application/octet-stream'
        });
        
        const url = URL.createObjectURL( blob );
        var link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', 'project.cmx' );
        
        var event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );
    }

    static encode( s ) {
        var out = [];
        for ( var i = 0; i < s.length; i++ ) {
            out[i] = s.charCodeAt(i);
        }
        return new Uint8Array( out );
    }

    //save as png
    static saveAsPNG(){
        canvas.toCanvasElement().toBlob(function(blob){
            saveAs(blob, "myIMG.png");
        });
    }

    //open
    static open(e){
        canvas.clear()
        console.log('change')
        var files = e.currentTarget.files;
        console.log(files);
        if (files.length <= 0) {
        return false;
        }

        var fr = new FileReader();

        fr.onload = function(e) { 
        console.log(e);
        var result = JSON.parse(e.target.result);
        //var formatted = JSON.stringify(result, null, 2);
            console.log(result)
            canvas.loadFromJSON(result, function(){
                canvas.requestRenderAll()
                UndoRedo.updateObjects()
                UndoRedo.saveState();
            })
        }

        fr.readAsText(files.item(0));
    }

    //clear
    static clear(){
        canvas.clear()
        UndoRedo.saveState()
    }

    //isblank
    static isBlank(){
        const state = canvas.getObjects()
        console.log(state)
        if(state.length == 0){
            alert("Is Document Blank : TRUE")
        }else{
            alert("Is Document Blank : FALSE")
        }
    }
}
//class Edit
class Edit{
    static clipboard = null;
    static clonedObjects = []
    static copy(cut = false){
        if(canvas.getActiveObject.type == "group"){
            let group = canvas.getActiveObject();
            let clonedGroup = null
            const objects = group._objects;
    
            if(cut){
                canvas.remove(canvas.getActiveObject())
            }
            //clone the group
            group.clone(function(cloned) {
                clonedGroup = cloned;
            }, UndoRedo.attributes);
            //clone froup objects
            objects.forEach(o => {
                o.clone(function(cloned) {
                    Edit.clonedObjects.push(cloned);
                }, UndoRedo.attributes);
            })
            clonedGroup._objects = Edit.clonedObjects;
            Edit.clipboard = clonedGroup;
        }else{
            let object = canvas.getActiveObject();
            //clone the object
            object.clone(function(cloned) {
                Edit.clipboard = cloned;
            }, UndoRedo.attributes);
            
        }
    }
    static paste() {
        // clone again, so you can do multiple copies.
        /*console.log(Edit.clipboard)
        Edit.clipboard.set({
            left: Edit.clipboard.left + 100,
            top: Edit.clipboard.top + 100,
            evented: true,
        });
        canvas.add(Edit.clipboard).requestRenderAll()
        Canvas.upgradeId(Edit.clipboard) */
        //Canvas.ungroup()

        //if the cloned object is a group
        if(Edit.clonedObjects.length !== 0){
            Edit.clonedObjects.forEach((o, index)=> {
                o.clone(function(cloned) {
                    Edit.clonedObjects[index] = cloned;
                }, UndoRedo.attributes);
            })
        }
        Edit.clipboard.clone(function(clonedObj) {
            console.log(clonedObj)
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = canvas;
                clonedObj._objects = Edit.clonedObjects
                
                clonedObj.forEachObject(function(obj) {
                    canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            Edit.clipboard.top += 10;
            Edit.clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
            if(clonedObj.type === "group"){
                Canvas.upgradeId(clonedObj)
            }
        }, UndoRedo.attributes);

        UndoRedo.saveState()
    }
    static cut(){
        Edit.copy(true)

        UndoRedo.saveState()
    }
    static selectAll(){
        const group = new fabric.Group(canvas.getObjects(),{
            originX: "center",
            originY: "center"
        })
        canvas.clear()
        canvas.add(group)
        canvas.setActiveObject(group)
        canvas.requestRenderAll()
    }
}

//class Object
class Obj{
    static alignLeft(){
        const object = canvas.getActiveObject()
        object.set({
            left: object.width/2
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }
    static alignRight(){
        const object = canvas.getActiveObject()
        object.set({
            left: 1223 - object.width/2 // 1223 is the canvas width
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }
    static alignCenter(){
        const object = canvas.getActiveObject()
        object.set({
            left: 1223/2 // 1223 is the canvas width
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }

    static rotateLeft(){
        const object = canvas.getActiveObject()
        object.set({
            angle: object.angle - 45
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }
    static rotateRight(){
        const object = canvas.getActiveObject()
        object.set({
            angle: object.angle + 45
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }
    static rotate180(){
        const object = canvas.getActiveObject()
        object.set({
            angle: object.angle + 180
        })
        canvas.requestRenderAll()
        UndoRedo.saveState()
    }
}

class Structures{
    static open(file){
        fetch('../structures/'+file)
        .then(response => response.text())
        .then(data => {
            // Do something with your data
            console.log(data);
            var result = JSON.parse(data);
            //var formatted = JSON.stringify(result, null, 2);
                console.log(result)
                canvas.loadFromJSON(result, function(){
                    canvas.requestRenderAll()
                    UndoRedo.updateObjects()
                    UndoRedo.saveState();
                })
        });
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
            name: "line",
            stroke: 'black',
            strokeWidth: strokeWidth,
            lineAngle: angle,
            //evented: false,
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
    static getApothem(name){
        const nbrSides = Polygone.getNbrSides(name)
        const r = Polygone.radius * Math.cos(Math.PI / nbrSides)
        return r
    }

    //draw circle in centroid
    static drawCentroid(centroid, polygId){
        const circle = new fabric.Circle({
            name: "centroid",
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

    //check if two objects are equal
    static objectsEqual(o1, o2){
        return Object.keys(o1).length === Object.keys(o2).length 
        && Object.keys(o1).every(p => o1[p] === o2[p]);
    }

    // Compare Object Arrays
    static arraysEqual(a1, a2){
        return a1.length === a2.length && a1.every((o, idx) => Canvas.objectsEqual(o, a2[idx]));
    }

    static setSelectable(bool){
        canvas.getObjects().forEach(function(element){
            element.selectable = bool
        });
    }

    static ungroup(){
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
                    if(items[i].name === "centroid"){
                        const centroidCoords = {x: items[i].left, y: items[i].top}
                        const centroidId = items[i].polygId;
                        centroids[centroidId] = centroidCoords
                    }
                    else if(items[i].name === "midpoint"){
                        const midpointCoords = {x: items[i].left, y: items[i].top}
                        const midpointId = items[i].lineId;
                        midpoints[midpointId] = midpointCoords
                    }
                    else if(items[i].name === "line"){
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
                    if(items[i].name === "side"){
                        const lineId = items[i].lineId
                        items[i].center = midpoints[lineId]
                        items[i].line = lines[lineId]
                    }
                    canvas.add(items[i]);
                }                                           
                canvas.requestRenderAll();
            }
            //UndoRedo.saveState()
        })
    }

    static upgradeId(object){
        if(object.type == "group"){
            const lines = object._objects.filter (l => l.name == "line")
            lines.forEach(l => {
                const linesObj = object._objects.filter (o => o.lineId == l.lineId) 
                linesObj.forEach(o => {
                    if(o.lineId){
                        o.lineId = Canvas.lineId ;
                    }
                    /* if(o.polygId){
                        o.polygId = Polygone.polygId;
                    } */
                    //if(o.id) Polygone.polygId += 1;
                })
                Canvas.lineId ++
            })
        }else{
            if(o.lineId) Canvas.lineId += 1;
            if(o.polygId) Polygone.polygId += 1;
            if(o.id) Polygone.polygId += 1;
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

            case "text":
                return this.textAction(target, coord)
                break;

            case "eraser":
                return Toolbar.eraserAction(target)
                break;

            case "symbol":
                return Toolbar.symbolAction(target)
                break;
        
            default:
                break;
        }
    }

    static polygoneAction(target){
        switch (target.name) {
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
        if(target.name == "circle"){
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
        }else if(target.name == "side"){
            return SimpleBond.drawInsidePolyg(target.line)
        }
    }

    static textAction(target, coord=null){
        if(target == "canvas"){
            return new Text(coord.x, coord.y)
        }else if(target.name == "circle" || target.name == "bond"){
           return Text.displayAtomName(target, target.name)
        }
    }

    static arrowAction(coord){
        return new Arrow(coord.x, coord.y)
    }

    
    static selectionAction(){
        canvas.selection = true;
        //set elements selectable attributes to true
        Canvas.setSelectable(true)

        canvas.on('selection:created',function(){
            if (!canvas.getActiveObject()) {                  
                 return;
            }
            if (canvas.getActiveObject().type !== 'activeSelection') {
            return;
            }
            
            //group the selection and set the origins to center
            canvas.getActiveObject().toGroup().set({
                left: canvas.getActiveObject().left + canvas.getActiveObject().width/2, 
                top: canvas.getActiveObject().top + canvas.getActiveObject().height/2, 
                originX: "center",
                originY: "center",

            });
            console.log(canvas.getActiveObject())
            /* const group = new fabric.Group(canvas.getActiveObject()._objects,{
                originX: "center",
                originY: "center",
            }) */
            //canvas.setActiveObject(group)
            canvas.requestRenderAll();
        })  

        //clear the selection
        canvas.on('selection:cleared',function(e)
        {             
            if (!canvas.getObjects()) {
                return;
            }
            Canvas.ungroup()
            UndoRedo.updateObjects()
        })
    }

    static eraserAction(target){
        return new Eraser(target)
    }

    static symbolAction(target){
        switch (this.toolType) {
            case "plus":
                return new Plus(target)
                break;
            case "minus":
                return new Minus(target)
                break;
            case "circle-plus":
                return new CirclePlus(target)
                break;
            case "circle-minus":
                return new CircleMinus(target)
                break;
        
            default:
                break;
        }
    }
}


////////////////////// MAIN //////////////////////
window.addEventListener('load', function(event) {
    setTimeout(() => {
        document.querySelector('.loader-container').style.display = "none"
    }, 2000);
});

//set the fabric canvas
const canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: 1500, height: 600});
canvas.hoverCursor = 'pointer';
canvas.selection = false;

//save state for undo/redo
UndoRedo.saveState();



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
        UndoRedo.saveState();
    }
    //other tools action when click on a circle or square
    else if (e.target){
        Toolbar.action(e.target)
        if(Toolbar.tool !== "selection" && (Toolbar.tool !== "text" && e.target.name !== "text") ){
            UndoRedo.saveState();
        }
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
        if(Toolbar.tool !== "selection" && Toolbar.tool !== "eraser"){
            UndoRedo.saveState();
        }
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
        UndoRedo.saveState()
    }
})

//EVENT: Canvas hover
canvas.on('mouse:over', function(e){
    if (e.target && (e.target.name == "circle" || e.target.name == "bond" || e.target.name == "side")){
        Canvas.setBorderColor(e.target)
    }
})

//EVENT: canvas hover out
canvas.on('mouse:out', function(e){
    if (e.target && (e.target.name == "circle" || e.target.name == "bond" || e.target.name == "side") ){
        Canvas.setBorderColorToDefault(e.target)
    }
})

/* //EVENT: object moving
canvas.on('object:moved', function(e){
    UndoRedo.saveState()
    console.log(('object moved'))
}) */

//EVENT: object rotating
canvas.on('object:modified', function(e){
    UndoRedo.saveState()
    console.log("modified")
})

//EVENT text change
canvas.on('text:changed', function(e) {
    UndoRedo.saveState()
});

//clear the selection
canvas.on('selection:cleared',function(e)
{             
    if (!canvas.getObjects()) {
        return;
    }
    Canvas.ungroup()
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
document.querySelector('.text-icons').addEventListener('click', (e)=>{
    document.querySelector('#text-wrapper').classList.toggle("open");
})

//text decoration
/* const labels = document.querySelectorAll('#text-controls-additional label')
console.log(labels)
labels.forEach(l => l.addEventListener('click', function(e){
    l.classList.toggle("selected");
})); */

//change text color
document.getElementById('text-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({fill: this.value})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//const fonts = {""}
//change font family
document.getElementById('font-family').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set("fontFamily", this.value);
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change text align
document.getElementById('text-align').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set("textAlign", this.value);
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change background color
document.getElementById('text-bg-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({backgroundColor: this.value})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change text line background color
document.getElementById('text-lines-bg-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({textBackgroundColor: this.value})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change stroke color
document.getElementById('text-stroke-color').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({stroke: this.value})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change stroke width
document.getElementById('text-stroke-width').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({strokeWidth: parseInt(this.value)})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change font size
document.getElementById('text-font-size').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({fontSize: parseInt(this.value)})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//change line height
document.getElementById('text-line-height').onchange = function() {
    const obj = canvas.getActiveObject()
    if(obj && obj.name === "text"){
        obj.set({lineHeight: parseInt(this.value)})
        canvas.requestRenderAll();
        UndoRedo.saveState()
    }
};

//text decoration
radios5 = document.getElementsByName("fonttype");  // wijzig naar button
for(var i = 0, max = radios5.length; i < max; i++) {
    radios5[i].onclick = function() {
        //if(canvas.getActiveObject.name == "text"){
                if(document.getElementById(this.id).checked == true) {
                    if(this.id == "text-cmd-bold") {
                        canvas.getActiveObject().set("fontWeight", "bold");
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.add("selected")
                    }
                    if(this.id == "text-cmd-italic") {
                        canvas.getActiveObject().set("fontStyle", "italic");
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.add("selected")
                    }
                    if(this.id == "text-cmd-underline") {
                        canvas.getActiveObject().set("underline", true);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.add("selected")
                    }
                    if(this.id == "text-cmd-linethrough") {
                        canvas.getActiveObject().set("linethrough", true);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.add("selected")
                    }
                    if(this.id == "text-cmd-overline") {
                        canvas.getActiveObject().set("overline", true);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.add("selected")
                    }
                    
                UndoRedo.saveState()
                    
                } else {
                    if(this.id == "text-cmd-bold") {
                        canvas.getActiveObject().set("fontWeight", "");
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.remove("selected")
                    }
                    if(this.id == "text-cmd-italic") {
                        canvas.getActiveObject().set("fontStyle", "");
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.remove("selected")
                    }  
                    if(this.id == "text-cmd-underline") {
                        canvas.getActiveObject().set("underline", false);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.remove("selected")
                    }
                    if(this.id == "text-cmd-linethrough") {
                        canvas.getActiveObject().set("linethrough", false);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.remove("selected")
                    }  
                    if(this.id == "text-cmd-overline") {
                        canvas.getActiveObject().set("overline", false);
                        const label = document.getElementById(this.id).previousElementSibling;
                        label.classList.remove("selected")
                    }
                    UndoRedo.saveState()
                }
                
                canvas.renderAll();
            }
        //}
}


//change font select options font family
Array.from(document.querySelector("#font-family").options).forEach(function(option) {
    option.style.fontFamily = `${option.value}, sans-serif`
});


///////////////////////NAVBAR MENU ////////////////////////
//undo & redo
const redoBtn = document.querySelector("#redo")
const undoBtn = document.querySelector("#undo")

undoBtn.addEventListener('click', UndoRedo.undo)
redoBtn.addEventListener('click', UndoRedo.redo)


//New
//current tab
document.getElementById('currentTab').addEventListener('click', New.currentTab)
document.getElementById('newTab').addEventListener('click', New.newTab)

//save file
document.getElementById('save').addEventListener('click', Document.save)
//save as png
document.getElementById('saveAs').addEventListener('click', Document.saveAsPNG)
//open
document.getElementById('open').addEventListener('change', function(e){
    Document.open(e)
})
//clear
document.getElementById('clear').addEventListener('click', Document.clear)
//is blank
document.getElementById('isBlank').addEventListener('click', Document.isBlank)

//Edit
document.getElementById('copy').addEventListener('click', Edit.copy)
document.getElementById('paste').addEventListener('click', Edit.paste)
document.getElementById('cut').addEventListener('click', Edit.cut)
document.getElementById('select-all').addEventListener('click', Edit.selectAll)

//Object//
document.getElementById('align-left').addEventListener('click', Obj.alignLeft)
document.getElementById('align-right').addEventListener('click', Obj.alignRight)
document.getElementById('align-center').addEventListener('click', Obj.alignCenter)
document.getElementById('rotate-left').addEventListener('click', Obj.rotateLeft)
document.getElementById('rotate-right').addEventListener('click', Obj.rotateRight)
document.getElementById('rotate-180').addEventListener('click', Obj.rotate180)


//////////structures//////////
const structures = document.querySelectorAll('.structure')
structures.forEach(st => st.addEventListener('click', function(e){
    const file = e.currentTarget.getAttribute('data-name')
    Structures.open(file)
}));

////////////////Shortcuts////////////////////
document.addEventListener('keydown', function(e){
    if (e.ctrlKey && e.key === 'y') {
        UndoRedo.redo();
    }
    else if (e.ctrlKey && e.key === 'z') {
        UndoRedo.undo();

    }else if (e.ctrlKey && e.code === 'Space') {
        Document.clear();

    }else if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        Document.save();

    }else if (e.ctrlKey && e.key === 'o') {
        e.preventDefault()
        document.querySelector("label[for='open']").click()

    }else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        Edit.selectAll();

    }else if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        document.querySelector("#newTab").click()

    }else if (e.code === 'Delete') {
        e.preventDefault()
        if(canvas.getActiveObject()){
            return new Eraser(canvas.getActiveObject())
        }
    }
})