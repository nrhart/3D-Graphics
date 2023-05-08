class Cube {
    constructor(col) {
        this.type = 'cube';
        this.color = col;
        this.matrix = new Matrix4();
    }

    // Render this shape
    render() {

        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the color of a point to u_FragColor uniform variable

        // Front of cube
        drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        // Back of cube
        drawTriangle3D([1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3D([1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        // Top of cube
        drawTriangle3D([0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
        drawTriangle3D([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        // Bottom of cube
        drawTriangle3D([1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        drawTriangle3D([1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);

        // Right of cube
        drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
        drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);

        // Left of cube
        drawTriangle3D([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]);
        drawTriangle3D([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
    }
}