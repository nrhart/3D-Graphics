class Cube {
    constructor(col) {
        this.type = 'cube';
        this.color = col;
        this.matrix = new Matrix4();
        this.textureNum = -1;
    }

    // Render this shape
    render() {

        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable

        // Front of cube
        drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        // Back of cube
		drawTriangle3DUVNormal( [0,0,1, 0,1,1, 1,1,1 ],  [1,0, 1,1, 0,1], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
		drawTriangle3DUVNormal( [0,0,1, 1,1,1, 1,0,1 ],  [1,0, 0,1, 0,0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        // Top of cube
		drawTriangle3DUVNormal( [0,1,0, 0,1,1, 1,1,1 ],  [0,0, 0,1, 1,1], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
		drawTriangle3DUVNormal( [0,1,0, 1,1,1, 1,1,0 ],  [0,0, 1,1, 1,0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        // Bottom of cube
		drawTriangle3DUVNormal( [0,0,0, 1,0,1, 1,0,0 ],  [0,1, 1,0, 1,1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
		drawTriangle3DUVNormal( [0,0,0, 0,0,1, 1,0,1 ],  [0,1, 0,0, 1,0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);

        // Right of cube
		drawTriangle3DUVNormal( [1,0,0, 1,1,0, 1,1,1 ],  [0,0, 0,1, 1,1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
		drawTriangle3DUVNormal( [1,0,0, 1,0,1, 1,1,1 ],  [0,0, 1,0, 1,1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);

        // Left of cube
		drawTriangle3DUVNormal( [0,0,0, 0,0,1, 0,1,1 ],  [1,0, 0,0, 0,1], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
		drawTriangle3DUVNormal( [0,0,0, 0,1,0, 0,1,1 ],  [1,0, 1,1, 0,1], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
    }


    // Render this shape
    renderfast() {

        var rgba = this.color;

        //gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform1i(u_whichTexture, this.textureNum);

        var allverts = [];
        var uvverts = [];
        var normverts = [];

        // Front of cube
        allverts=allverts.concat([0,0,0, 1,1,0, 1,0,0]);  uvverts=uvverts.concat([0,0, 1,1, 1,0]); normverts=normverts.concat([0,0,-1, 0,0,-1, 0,0,-1]);
        allverts=allverts.concat([0,0,0, 0,1,0, 1,1,0]);  uvverts=uvverts.concat([0,0, 0,1, 1,1]); normverts=normverts.concat([0,0,-1, 0,0,-1, 0,0,-1]);

        // Back of cube
        allverts=allverts.concat([0,0,1, 0,1,1, 1,1,1 ]);  uvverts=uvverts.concat([1,0, 1,1, 0,1]); normverts=normverts.concat([0,0,1, 0,0,1, 0,0,1]);
        allverts=allverts.concat([0,0,1, 1,1,1, 1,0,1 ]);  uvverts=uvverts.concat([1,0, 0,1, 0,0]); normverts=normverts.concat([0,0,1, 0,0,1, 0,0,1]);
 
        // Top of cube
        allverts=allverts.concat([0,1,0, 0,1,1, 1,1,1 ]);  uvverts=uvverts.concat([0,0, 0,1, 1,1]); normverts=normverts.concat([0,1,0, 0,1,0, 0,1,0]);
        allverts=allverts.concat([0,1,0, 1,1,1, 1,1,0 ]);  uvverts=uvverts.concat([0,0, 1,1, 1,0]); normverts=normverts.concat([0,1,0, 0,1,0, 0,1,0]);

        // Bottom of cube
        allverts=allverts.concat([0,0,0, 1,0,1, 1,0,0 ]);  uvverts=uvverts.concat([0,1, 1,0, 1,1]); normverts=normverts.concat([0,-1,0, 0,-1,0, 0,-1,0]);
        allverts=allverts.concat([0,0,0, 0,0,1, 1,0,1 ]);  uvverts=uvverts.concat([0,1, 0,0, 1,0]); normverts=normverts.concat([0,-1,0, 0,-1,0, 0,-1,0]);

        // Right of cube
        allverts=allverts.concat([1,0,0, 1,1,0, 1,1,1 ]);  uvverts=uvverts.concat([0,0, 0,1, 1,1]); normverts=normverts.concat([1,0,0, 1,0,0, 1,0,0]);
        allverts=allverts.concat([1,0,0, 1,0,1, 1,1,1 ]);  uvverts=uvverts.concat([0,0, 1,0, 1,1]); normverts=normverts.concat([1,0,0, 1,0,0, 1,0,0]);

        // Left of cube
        allverts=allverts.concat([0,0,0, 0,0,1, 0,1,1 ]);  uvverts=uvverts.concat([1,0, 0,0, 0,1]); normverts=normverts.concat([-1,0,0, -1,0,0, -1,0,0]);
        allverts=allverts.concat([0,0,0, 0,1,0, 0,1,1 ]);  uvverts=uvverts.concat([1,0, 1,1, 0,1]); normverts=normverts.concat([-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal(allverts, uvverts, normverts);
    }
}