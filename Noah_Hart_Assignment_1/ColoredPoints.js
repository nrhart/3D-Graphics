// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedSegment = 10;
let g_selectedType = POINT;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    // Button Events (Shape Type)
    //document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    //document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('clearButton').onclick = function() { g_shapesList=[]; renderAllShapes();};

    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
    document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };

    // Color Slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    // Size Slider Events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegment = this.value; });

}


function main() {
    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = []

function click(ev) {
   
    // Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Create and store the new point
    let point;
    if(g_selectedType == POINT) {
        point = new Point();
    } else if(g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else {
        point = new Circle();
        point.segments = g_selectedSegment;
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    // Draw every shape that is supposed to be in the canvas
    renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return([x,y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
    // Check the time at the start of this function
    var startTime = performance.now();
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //var len = g_points.length;
    var len = g_shapesList.length;
    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    // Check the time at the end of the function, and show on web page
    // var duration = performance.now() - startTime;
    // sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot")
}

// function sendTextToHTML(text, htmlID) {
//     var htmlElm = document.getElementById(htmlID);
//     if(!htmlElm) {
//         console.log("Failed to get " + htmlID + " from HTML");
//         return;
//     }
//     htmlElm.innerHTML = text;
// }

function drawPicture() {
    g_shapesList = [];
    
    let background = new Point();
    background.position = [0.0,0.0];
    background.color = [0.0, 1.0 , 1.0, 1.0];
    background.size = 1000;
    g_shapesList.push(background);

    let ground = new Point();
    ground.position = [0.0,-1.75];
    ground.color = [0.0, 1.0 , 0.4, 1.0];
    ground.size = 500;
    g_shapesList.push(ground);

    let sun = new Circle();
    sun.position = [-0.6, 0.6];
    sun.color = [1.0, 1.0 , 0.0, 1.0];
    sun.size = 50;
    sun.segments = 100;
    g_shapesList.push(sun);

    let triangle1 = new Triangle();
    triangle1.position = [0.0,-0.01];
    triangle1.color = [1.0, 0.7 , 0.9, 1.0];
    triangle1.size = 25;
    g_shapesList.push(triangle1);

    let triangle2 = new Triangle();
    triangle2.position = [0.2,-0.01];
    triangle2.color = [1.0, 0.7 , 0.9, 1.0];
    triangle2.size = 25;
    g_shapesList.push(triangle2);

    let square1 = new Point();
    square1.position = [0.1,-0.19];
    square1.color = [1.0, 0.7 , 0.9, 1.0];
    square1.size = 75;
    g_shapesList.push(square1);

    let square2 = new Point();
    square2.position = [0.4,-0.25];
    square2.color = [1.0, 0.7 , 0.9, 1.0];
    square2.size = 50;
    g_shapesList.push(square2);

    let square3 = new Point();
    square3.position = [0.6,-0.25];
    square3.color = [1.0, 0.7 , 0.9, 1.0];
    square3.size = 50;
    g_shapesList.push(square3);

    let circle1 = new Circle();
    circle1.position = [0.0, -0.1];
    circle1.color = [0.0, 0.0 , 0.0, 1.0];
    circle1.size = 8;
    circle1.segments = 100;
    g_shapesList.push(circle1);

    let circle2 = new Circle();
    circle2.position = [0.2, -0.1];
    circle2.color = [0.0, 0.0 , 0.0, 1.0];
    circle2.size = 8;
    circle2.segments = 100;
    g_shapesList.push(circle2);

    let circle3 = new Circle();
    circle3.position = [0.1, -0.2];
    circle3.color = [0.0, 0.0 , 0.0, 1.0];
    circle3.size = 9;
    circle3.segments = 100;
    g_shapesList.push(circle3);
    
    let circle4 = new Circle();
    circle4.position = [0.1, -0.2];
    circle4.color = [1.0, 0.7 , 0.9, 1.0];
    circle4.size = 8;
    circle4.segments = 100;
    g_shapesList.push(circle4);

    let square4 = new Point();
    square4.position = [0.075,-0.2];
    square4.color = [0.0, 0.0 , 0.0, 1.0];
    square4.size = 4;
    g_shapesList.push(square4);

    let square5 = new Point();
    square5.position = [0.125,-0.2];
    square5.color = [0.0, 0.0 , 0.0, 1.0];
    square5.size = 4;
    g_shapesList.push(square5);

    let triangle3 = new Triangle();
    triangle3.position = [0.3,-0.375];
    triangle3.color = [1.0, 0.7 , 0.9, 1.0];
    triangle3.size = 25;
    triangle3.down = true;
    g_shapesList.push(triangle3);

    let triangle4 = new Triangle();
    triangle4.position = [0.4,-0.375];
    triangle4.color = [1.0, 0.7 , 0.9, 1.0];
    triangle4.size = 25;
    triangle4.down = true;
    g_shapesList.push(triangle4);

    let triangle5 = new Triangle();
    triangle5.position = [0.55,-0.375];
    triangle5.color = [1.0, 0.7 , 0.9, 1.0];
    triangle5.size = 25;
    triangle5.down = true;
    g_shapesList.push(triangle5);

    let triangle6 = new Triangle();
    triangle6.position = [0.65,-0.375];
    triangle6.color = [1.0, 0.7 , 0.9, 1.0];
    triangle6.size = 25;
    triangle6.down = true;
    g_shapesList.push(triangle6);

    let triangle7 = new Triangle();
    triangle7.position = [0.85,-0.15];
    triangle7.color = [1.0, 0.7 , 0.9, 1.0];
    triangle7.size = 25;
    triangle7.right = true;
    triangle7.flip = true;
    g_shapesList.push(triangle7);

    let triangle8 = new Triangle();
    triangle8.position = [0.1,-0.3];
    triangle8.color = [0.0, 0.0 , 0.0, 1.0];
    triangle8.size = 10;
    g_shapesList.push(triangle8);

    let triangle9 = new Triangle();
    triangle9.position = [-0.375,0.6];
    triangle9.color = [1.0, 1.0 , 0.0, 1.0];
    triangle9.size = 30;
    g_shapesList.push(triangle9);

    let triangle10 = new Triangle();
    triangle10.position = [-0.825,0.6];
    triangle10.color = [1.0, 1.0 , 0.0, 1.0];
    triangle10.size = 30;
    g_shapesList.push(triangle10);

    let triangle11 = new Triangle();
    triangle11.position = [-0.6,0.375];
    triangle11.color = [1.0, 1.0 , 0.0, 1.0];
    triangle11.size = 30;
    triangle11.down = true;
    g_shapesList.push(triangle11);

    let triangle12 = new Triangle();
    triangle12.position = [-0.6,0.825];
    triangle12.color = [1.0, 1.0 , 0.0, 1.0];
    triangle12.size = 30;
    g_shapesList.push(triangle12);

    let triangle13 = new Triangle();
    triangle13.position = [-0.375,0.375];
    triangle13.color = [1.0, 1.0 , 0.0, 1.0];
    triangle13.size = 30;
    triangle13.right = true;
    triangle13.flip = true;
    g_shapesList.push(triangle13);

    let triangle14 = new Triangle();
    triangle14.position = [-0.375,0.6];
    triangle14.color = [1.0, 1.0 , 0.0, 1.0];
    triangle14.size = 30;
    triangle14.down = true;
    g_shapesList.push(triangle14);

    let triangle15 = new Triangle();
    triangle15.position = [-0.825,0.6];
    triangle15.color = [1.0, 1.0 , 0.0, 1.0];
    triangle15.size = 30;
    triangle15.down = true;
    g_shapesList.push(triangle15);


    let triangle16 = new Triangle();
    triangle16.position = [-0.375,0.85];
    triangle16.color = [1.0, 1.0 , 0.0, 1.0];
    triangle16.size = 30;
    triangle16.down = true;
    triangle16.right = true;
    triangle16.flip = true;
    g_shapesList.push(triangle16);

    let triangle17 = new Triangle();
    triangle17.position = [-0.8,0.85];
    triangle17.color = [1.0, 1.0 , 0.0, 1.0];
    triangle17.size = 30;
    triangle17.down = true;
    triangle17.right = true;
    g_shapesList.push(triangle17);

    let triangle18 = new Triangle();
    triangle18.position = [-0.8,0.35];
    triangle18.color = [1.0, 1.0 , 0.0, 1.0];
    triangle18.size = 30;
    triangle18.right = true;
    g_shapesList.push(triangle18);

    let triangle19 = new Triangle();
    triangle19.position = [-0.2,-0.6];
    triangle19.color = [0.0, 0.4 , 0.0, 1.0];
    triangle19.size = 20;
    g_shapesList.push(triangle19);

    let triangle20 = new Triangle();
    triangle20.position = [-0.25,-0.6];
    triangle20.color = [0.0, 0.4 , 0.0, 1.0];
    triangle20.size = 20;
    g_shapesList.push(triangle20);

    let triangle21 = new Triangle();
    triangle21.position = [-0.7,-0.8];
    triangle21.color = [0.0, 0.4 , 0.0, 1.0];
    triangle21.size = 20;
    g_shapesList.push(triangle21);

    let triangle22 = new Triangle();
    triangle22.position = [-0.75,-0.8];
    triangle22.color = [0.0, 0.4 , 0.0, 1.0];
    triangle22.size = 20;
    g_shapesList.push(triangle22);

    let triangle23 = new Triangle();
    triangle23.position = [0.7,-0.9];
    triangle23.color = [0.0, 0.4 , 0.0, 1.0];
    triangle23.size = 20;
    g_shapesList.push(triangle23);

    let triangle24 = new Triangle();
    triangle24.position = [0.75,-0.9];
    triangle24.color = [0.0, 0.4 , 0.0, 1.0];
    triangle24.size = 20;
    g_shapesList.push(triangle24);

    // Draw every shape that is supposed to be in the canvas
    renderAllShapes();
}