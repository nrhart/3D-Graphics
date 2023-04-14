// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    //var v1 = new Vector3([2.25, 2.25, 0]);
    //drawVector(v1, "red");
}

function drawVector(v, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20);
    ctx.stroke();
}

function angleBetween(v1, v2) {
    return Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()))/Math.PI * 180;
}

function areaTriangle(v1,v2) {
    return Vector3.cross(v1,v2).magnitude()/2;
}

function handleDrawEvent() {
    ctx.fillRect(0, 0, 400, 400);
    var v1 = new Vector3([document.getElementById("v1x").value, document.getElementById("v1y").value, 0]);
    drawVector(v1, "red");
    var v2 = new Vector3([document.getElementById("v2x").value, document.getElementById("v2y").value, 0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    ctx.fillRect(0, 0, 400, 400);
    var v1 = new Vector3([document.getElementById("v1x").value, document.getElementById("v1y").value, 0]);
    drawVector(v1, "red");
    var v2 = new Vector3([document.getElementById("v2x").value, document.getElementById("v2y").value, 0]);
    drawVector(v2, "blue");
    var operation = document.getElementById("operations");
    if(operation.value == "add") {
        var v3 = v1.add(v2);
        drawVector(v3, "green");
    }else if(operation.value == "sub") {
        var v3 = v1.sub(v2);
        drawVector(v3, "green");
    }else if(operation.value == "mul") {
        var v3 = v1.mul(document.getElementById("scalar").value);
        var v4 = v2.mul(document.getElementById("scalar").value);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }else if(operation.value == "div") {
        var v3 = v1.div(document.getElementById("scalar").value);
        var v4 = v2.div(document.getElementById("scalar").value);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }else if(operation.value == "mag") {
        console.log("Magnitude v1: ", v1.magnitude());
        console.log("Magnitude v2: ", v2.magnitude());
    }else if(operation.value == "nor") {
        var v3 = normalize(v1);
        var v4 = normalize(v2);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }else if(operation.value == "ang") {
        var v3 = angleBetween(v1, v2);
        console.log("Angle: ", v3);
    }else if(operation.value == "cro") {
        var v3 = areaTriangle(v1,v2);
        console.log("Area of the triangle: ", v3);
    }
}
