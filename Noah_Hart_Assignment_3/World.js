// World.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  percision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_VieweMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV,1.0,1.0);
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST)
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

    // // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    // Get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Set an initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Globals related to UI elements
let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_flipperAngle = 0;
let g_tailAngle = 0;
let g_headAngle = 0;
let g_blowHole = 1;
let g_headAnimation = false;
let g_flipperAnimation = false;
let g_tailAnimation = false;
let g_blowHoleAnimation = false;
let g_reachPeak = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    // Button Events
    //Flippers
    document.getElementById('animationFlipperOffButton').onclick = function () { g_flipperAnimation = false; document.getElementById('flipperSlider').setAttribute('value', g_flipperAngle) };
    document.getElementById('animationFlipperOnButton').onclick = function () { g_flipperAnimation = true; };

    // Tail
    document.getElementById('animationTailOffButton').onclick = function () { g_tailAnimation = false; document.getElementById('tailSlider').setAttribute('value', g_tailAngle) };
    document.getElementById('animationTailOnButton').onclick = function () { g_tailAnimation = true; };

    // Head
    document.getElementById('animationHeadOffButton').onclick = function () { g_headAnimation = false; document.getElementById('headSlider').setAttribute('value', g_headAngle) };
    document.getElementById('animationHeadOnButton').onclick = function () { g_headAnimation = true; };

    // Master Switch
    document.getElementById('animationAllOffButton').onclick = function () {
        g_headAnimation = false; g_tailAnimation = false; g_flipperAnimation = false;
        document.getElementById('headSlider').setAttribute('value', g_headAngle);
        document.getElementById('tailSlider').setAttribute('value', g_tailAngle);
        document.getElementById('flipperSlider').setAttribute('value', g_flipperAngle)
    };
    document.getElementById('animationAllOnButton').onclick = function () { g_headAnimation = true; g_tailAnimation = true; g_flipperAnimation = true };

    // Slider Events
    document.getElementById('tailSlider').addEventListener('mousemove', function () { g_tailAngle = this.value; renderAllShapes(); })
    document.getElementById('flipperSlider').addEventListener('mousemove', function () { g_flipperAngle = this.value; renderAllShapes(); })
    document.getElementById('headSlider').addEventListener('mousemove', function () { g_headAngle = this.value; renderAllShapes(); })
    document.getElementById('angleXSlider').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderAllShapes(); })
    document.getElementById('angleYSlider').addEventListener('mousemove', function () { g_globalAngleY = this.value; renderAllShapes(); })

}


function main() {
    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Specify the color for clearing <canvas>
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);

    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

var fps = document.getElementById("fps");
var startTime = Date.now();
var frame = 0;

// Called by browser repeartedly whenever its time
function tick() {
    // Save the current time
    g_seconds = performance.now() / 1000.0 - g_startTime;
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(1);
        startTime = time;
        frame = 0;
    }
    // Update Animation Angles
    updateAnimationAngles();

    // Draw everything
    renderAllShapes();

    // Tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_flipperAnimation) {
        g_flipperAngle = (30 * Math.sin(g_seconds));
    }
    if (g_tailAnimation) {
        g_tailAngle = (25 * Math.sin(g_seconds));
    }
    if (g_headAnimation) {
        g_headAngle = (45 * Math.sin(g_seconds));
    }
    if (g_blowHoleAnimation) {
        if (g_reachPeak == false) {
            g_blowHole -= 0.01;
            if (g_blowHole <= -1.5) {
                g_reachPeak = true;
            }
        } else {
            g_blowHole += 0.01;
            if (g_blowHole > 1) {
                g_blowHoleAnimation = false;
            }
        }
    }
}

function click(ev) {
    // Extract the event click and return it in WebGL coordinates
    let [x, y] = convertCoordinatesEventToGL(ev);

    if (ev.shiftKey) {
        g_blowHoleAnimation = true;
        g_reachPeak = false;
    } else {
        g_globalAngleX = 100 * x;
        g_globalAngleY = -100 * y;
    }

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

    return ([x, y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
    // Check the time at the start of this function
    var startTime = performance.now();

    // Pass the matrix to u_ModelMatrix attributes
    var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0);
    globalRotMat.rotate(g_globalAngleY, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawBlockyAnimal();
}

function drawBlockyAnimal() {
    var cone = new Cone([1.0, 1.0, 0.0, 1.0]);
    cone.matrix.translate(0.5, 0.5, 0.0);
    //cone.matrix.scale(0.5, 0.5, 1.0);
    //cone.matrix.rotate(-90,1,0,0);
    //cone.render();
    // Draw Dolphin body
    var dolphinBody = new Cylinder([0.6, 1.0, 1.0, 1.0]);
    dolphinBody.matrix.translate(0.0, 0.0, 0.4);
    dolphinBody.matrix.rotate(180, 1, 0, 0);
    dolphinBody.matrix.scale(1.0, 1.0, 0.9);
    dolphinBody.render();

    // Fin
    var topFin = new Cone([0.6, 1.0, 1.0, 1.0]);
    topFin.matrix.translate(0.0, 0.2, 0.0);
    topFin.matrix.rotate(90, 0, 1, 0);
    //topFin.matrix.rotate(45, 0, 0, 1);
    topFin.matrix.scale(0.8, 0.6, 0.3);
    topFin.render();

    // Draw a right flipper
    var rightFlipper = new Cone([0.6, 1.0, 1.0, 1.0]);
    rightFlipper.matrix.translate(0.2, 0.0, -0.2);
    rightFlipper.matrix.rotate(-90, 0, 0, 1);
    rightFlipper.matrix.rotate(-90, 0, 1, 0);
    rightFlipper.matrix.rotate(g_flipperAngle, 1, 0, 0);
    rightFlipper.matrix.scale(0.8, 0.8, 0.4);
    rightFlipper.render();

    // Draw a left flipper
    var leftFlipper = new Cone([0.6, 1.0, 1.0, 1.0]);
    leftFlipper.matrix.translate(-0.2, 0.0, -0.2);
    leftFlipper.matrix.rotate(90, 0, 0, 1);
    leftFlipper.matrix.rotate(90, 0, 1, 0);
    leftFlipper.matrix.rotate(g_flipperAngle, 1, 0, 0);
    leftFlipper.matrix.scale(0.8, 0.8, 0.4);
    leftFlipper.render();

    // head
    var head = new Cube([0.6, 1.0, 1.0, 1.0]);
    head.matrix.translate(0.0, -0.2, -0.58);
    head.matrix.rotate(g_headAngle, 0, 1, 0);
    head.matrix.scale(0.4, 0.4, 0.3);
    head.matrix.translate(-0.5, 0.0, -0.7);
    var headNose = new Matrix4(head.matrix);
    var headEyeRight = new Matrix4(head.matrix);
    var headEyeLeft = new Matrix4(head.matrix);
    head.render();

    // nose
    var nose = new Cube([0.6, 1.0, 1.0, 1.0]);
    nose.matrix = headNose;
    nose.matrix.translate(0.3, 0.1, -0.6);
    nose.matrix.scale(0.4, 0.2, 0.6);
    nose.render();

    // Eyes
    var eyeBlackRight = new Cube([0.0, 0.0, 0.0, 1.0]);
    eyeBlackRight.matrix = headEyeRight;
    eyeBlackRight.matrix.translate(1.0, 0.3, 0.2);
    eyeBlackRight.matrix.scale(0.01, 0.1, 0.2);
    eyeBlackRight.render();

    var eyeWhiteRight = new Cube([1.0, 1.0, 1.0, 1.0]);
    eyeWhiteRight.matrix = headEyeRight;
    eyeWhiteRight.matrix.translate(0.0, 0.0, 0.9);
    eyeWhiteRight.matrix.scale(0.7, 1.0, 1.0);
    eyeWhiteRight.render();

    var eyeBlackLeft = new Cube([0.0, 0.0, 0.0, 1.0]);
    eyeBlackLeft.matrix = headEyeLeft;
    eyeBlackLeft.matrix.translate(-0.01, 0.3, 0.2);
    eyeBlackLeft.matrix.scale(0.01, 0.1, 0.2);
    eyeBlackLeft.render();

    var eyeWhiteLeft = new Cube([1.0, 1.0, 1.0, 1.0]);
    eyeWhiteLeft.matrix = headEyeLeft;
    eyeWhiteLeft.matrix.translate(0.0, 0.0, 0.9);
    eyeWhiteLeft.matrix.scale(0.7, 1.0, 1.0);
    eyeWhiteLeft.render();

    // Tail and Joints
    var dolphinTail = new Cylinder([0.6, 1.0, 1.0, 1.0]);
    dolphinTail.matrix.translate(0.0, 0.0, 0.3);
    dolphinTail.matrix.rotate(g_tailAngle, 1, 0, 0);
    dolphinTail.matrix.scale(0.6, 0.6, 0.3);
    var dolphinTailExtend = new Matrix4(dolphinTail.matrix);
    dolphinTail.render();


    var cone = new Cone([0.6, 1.0, 1.0, 1.0]);
    cone.matrix = dolphinTailExtend;
    cone.matrix.translate(0.0, 0.0, 1.0);
    cone.matrix.scale(1.0, 1.0, 1.5);
    cone.matrix.rotate(90, 1, 0, 0);
    cone.matrix.rotate(g_tailAngle, 1, 0, 0);
    var dolphinTailFin = new Matrix4(cone.matrix);
    cone.render();

    var tailFin = new Cube([0.6, 1.0, 1.0, 1.0]);
    tailFin.matrix = dolphinTailFin;
    tailFin.matrix.translate(-0.45, 0.4, -0.05);
    tailFin.matrix.rotate(0, 1, 0, 0);
    tailFin.matrix.rotate(g_tailAngle, 1, 0, 0);
    tailFin.matrix.scale(0.9, 0.4, 0.1);
    tailFin.render();

    // Blow hole
    var blowHoleHole = new Cylinder([0.65, 1.0, 1.0, 1.0]);
    blowHoleHole.matrix.translate(0.0, 0.24, -0.3);
    blowHoleHole.matrix.rotate(90, 1, 0, 0);
    blowHoleHole.matrix.scale(0.2, 0.2, 0.4);
    blowHoleHole.render();

    var blowHole = new Cylinder([0.3, 1.0, 1.0, 1.0]);
    blowHole.matrix.translate(0.0, 0.2, -0.3);
    blowHole.matrix.rotate(90, 1, 0, 0);
    blowHole.matrix.scale(0.2, 0.2, 0.4);
    blowHole.matrix.scale(1.0, 1.0, g_blowHole);
    var topOfBlowHole = new Matrix4(blowHole.matrix);
    blowHole.render();

    var topBlowHole = new Cube([0.3, 1.0, 1.0, 1.0]);
    topBlowHole.matrix = topOfBlowHole;
    topBlowHole.matrix.scale(g_blowHole, g_blowHole, 0.2);
    topBlowHole.matrix.translate(-0.5, -0.5, 4.0);
    topBlowHole.render();

}