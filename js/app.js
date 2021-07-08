//Polygone: class
class Polygone{
    constructor(x, y, type, rotation=0){
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = rotation;
        this.atoms = [];
        this.bonds = [];
        this.lines = []; //array of lines that constitute the polygone (Sides)
        this.element = null;
        this.draw(); //draw the polygone
    }

    static radius = 30;

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

        this.addSquare()
        
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
            radius = radius/1.2
            break;
        case 4:
            this.rotation += 45
            radius = radius/1.35
            break;
        case 3:
            radius = radius/1.57;
            break;
        
        default:
            break;
        }

        const points = this.regularPolygonPoints(nbrSides, radius)

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

    //Benzene method: hexagone(6) with bonds inside
    drawBenzene(){
        const nbrSides = Polygone.getNbrSides(this.type)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 30;

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

        //get corners coord
        let polygPoints = this.addCircles(this.element)
        
        //get the centroid
        let centroid = this.getPolygCentroid(polygPoints)
        
        //add centroid coord to polygone attributes
        this.element['center'] = centroid

        //add circles
        let circles = this.addCircles(this.element)

        //draw polygone using lines
        this.drawPolygByLine(circles)

        //add bonds inside the polygone
        this.lines.forEach((line, index) => {
            if( [0, 2, 4].includes(index) ){
                SimpleBond.drawInsidePolyg(line)
            }
        })


        canvas.add(...circles).requestRenderAll();
    }

    //Cyclopentadiene method: pentagone(5) with bonds inside
    drawCyclopentadiene(){
        const nbrSides = Polygone.getNbrSides(this.type)
        const points = this.regularPolygonPoints(nbrSides, Polygone.radius)

        this.rotation += 270;

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

        //get corners coord
        let polygPoints = this.addCircles(this.element)
        
        //get the centroid
        let centroid = this.getPolygCentroid(polygPoints)
        
        //add centroid coord to polygone attributes
        this.element['center'] = centroid

        //add circles
        let circles = this.addCircles(this.element)

        //draw polygone using lines
        this.drawPolygByLine(circles)

        //add bonds inside the polygone
        this.lines.forEach((line, index) => {
            if( [1, 3].includes(index) ){
                SimpleBond.drawInsidePolyg(line)
            }
        })


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
                const line = Canvas.drawLine(c.left, c.top, circles[0].left, circles[0].top, c.originCenter);
                this.lines.push(line)
            }
            else{
                const line = Canvas.drawLine(c.left, c.top, circles[index+1].left, circles[index+1].top, c.originCenter);
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

    //add squares on sides
    addSquare(){
        this.lines.forEach(line => {
            const point1 = {x: line.x1, y:line.y1}
            const point2 = {x: line.x2, y:line.y2}
            const midpoint = {x: (point1.x + point2.x)/2,
                            y: (point1.y + point2.y)/2, 
                            angle: Canvas.getPointFromOrigin(point1, point2, 4).angle
                            } 
            const square = new fabric.Rect({
                line: line,
                type: 'side',
                originCenter: this.element.center,
                center: midpoint,
                width: 8, 
                height: 28, 
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

            canvas.add(square).requestRenderAll();
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
                originRadius =(originRadius/1.5) - 8;
                angle = 90;
                break;
            case 5:
                originRadius += -7;
                angle = 180;
                break;
            case 4:
                originRadius /= 1.5;
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
}

//class Bond
class SimpleBond{
    constructor(point1, point2, isAddCircle = true){
        this.point1 = point1;
        this.point2 = point2;
        this.origin = origin;
        this.circle = null;
        this.isAddCircle = isAddCircle;
        this.draw();
    }

    static length = 28;

    draw(){
        Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
        if (this.isAddCircle){
            this.addCircle()
        }
    }

    //add circles on corners
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
        
        this.circle = circle;
        canvas.add(circle).requestRenderAll()

    }

    static drawInsidePolyg (line){
        const p1 = {x: line.x1, y: line.y1}
        const p2 = {x: line.x2, y: line.y2}
        //coord of the new point 1
        const x1 = Canvas.getPointFromOrigin(line.originCenter, {x: p1.x, y: p1.y}, -10).x 
        const y1 = Canvas.getPointFromOrigin(line.originCenter, {x: p1.x, y: p1.y}, -10).y
        //coord of the new point 2
        const x2 = Canvas.getPointFromOrigin(line.originCenter, {x: p2.x, y: p2.y}, -10).x 
        const y2 = Canvas.getPointFromOrigin(line.originCenter, {x: p2.x, y: p2.y}, -10).y
  
        return new SimpleBond({x: x1, y: y1}, {x: x2, y: y2}, false)
    }

    static drawOutsidePolyg (circle){
        const x = circle.left
        const y = circle.top
        const point = Canvas.getPointFromOrigin(circle.originCenter, {x, y}, SimpleBond.length)
        const x2 = point.x
        const y2 = point.y
        //const lineAngle = point.angle
  
        //add a simple bond
        return new SimpleBond({x: x, y: y}, {x: x2, y: y2})
    }
}

//BoldBond class
class BoldBond extends SimpleBond{
    constructor(point1, point2) {
        super(point1, point2)
    }

    draw(){
        Canvas.drawLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y, false, 4)
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
        return new BoldBond({x: x, y: y}, {x: x2, y: y2})
    }
}

//Dashed Bond class
class DashedBond extends SimpleBond{
    constructor(point1, point2) {
        super(point1, point2)
    }

    draw(){
        const line = new fabric.Line([this.point1.x, this.point1.y, this.point2.x, this.point2.y], {
            strokeDashArray: [5, 5],
            strokeWidth: 2,
            stroke: 'black'
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
        return new DashedBond({x: x, y: y}, {x: x2, y: y2})
    }
}

//Canvas class: handle drawing
class Canvas{
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

    static drawLine(x1, y1, x2, y2, origin = false, strokeWidth = 2){
        const angle = Canvas.getPointFromOrigin({x:x1,y:y1}, {x:x2,y:y2}, 5).angle
        const line = new fabric.Line([x1, y1, x2, y2], {
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
    static setBorderColor(object, color = "blue"){
        object.set("stroke", color);
        canvas.requestRenderAll()
    }

    //set object border color to transparent
    static setBorderColorToDefault(object){
        Canvas.setBorderColor(object, "#56519f00")
    }
}

//Toolbar class:
class Toolbar{
    constructor() {
        this.tool = null;
        this.toolType = null;
    }

    static setCurrentTool(button){
        this.tool = button.getAttribute("data-name");
        this.toolType = button.getAttribute("data-type");
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
                const distance = Canvas.distance(target.originCenter, target.center)
                const point = Canvas.getPointFromOrigin(target.originCenter, target.center, distance)
                const angle = target.line.lineAngle + 180
                return new Polygone(point.x, point.y, Toolbar.toolType, angle)
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
            
                default:
                    break;
            }
        }else if(target.type == "side"){
            return SimpleBond.drawInsidePolyg(target.line)
        }
    }
}


////////////////////// MAIN //////////////////////


//set the fabric canvas
const canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: 1500, height: 600});
canvas.hoverCursor = 'pointer';

//set default tool
const toolBtn = document.querySelector('.tool.active');
Toolbar.setCurrentTool(toolBtn)


//EVENT: canvas click
canvas.on('mouse:down', function(e){
    const x = e.pointer.x
    const y = e.pointer.y

    if(e.target)
    Toolbar.action(e.target)
    else{
        Toolbar.action("canvas", {x, y})
    }

});

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
    })
  })