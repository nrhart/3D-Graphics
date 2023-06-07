class Cone {
    constructor(color) {
      this.type = 'cone';
      this.position = [0, 0, 0];
      this.color = color;
      this.size = 50.0;
      this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum = -2;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var segments = this.segments;
      
      gl.uniform1i(u_whichTexture, this.textureNum);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // pass matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      // Draw
      var d = this.size / 200;
      var height = this.size / 100;
  
      let angleStep = 360 / segments;
  
      // Top vertex
      let topPt = [xy[0], xy[1] + height, xy[2]];
  
      for (var angle = 0; angle < 360; angle += angleStep) {
        let centerPt = [xy[0], xy[1], xy[2]];
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, 0, Math.sin(angle1 * Math.PI / 180) * d];
        let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, 0, Math.sin(angle2 * Math.PI / 180) * d];
        let pt1 = [centerPt[0] + vec1[0], centerPt[1], centerPt[2] + vec1[2]];
        let pt2 = [centerPt[0] + vec2[0], centerPt[1], centerPt[2] + vec2[2]];
  
        // Side triangle
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3D([topPt[0], topPt[1], topPt[2], pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]]);
  
        // Base triangle
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        drawTriangle3D([xy[0], xy[1], xy[2], pt2[0], pt2[1], pt2[2], pt1[0], pt1[1], pt1[2]]);
      }
    }
  }
  