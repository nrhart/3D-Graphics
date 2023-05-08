class Cylinder {
  constructor(col) {
    this.type = 'cylinder';
    this.position = [0.0, 0.0, 0.0];
    this.color = col
    this.size = 50.0;
    this.segments = 10;
    this.matrix = new Matrix4();
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var segments = this.segments;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //pass matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Draw
    var d = this.size / 200;

    let angleStep = 360 / segments;
    for (var angle = 0; angle < 360; angle += angleStep) {
      let centerPt = [xy[0], xy[1], 0];
      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d, 0];
      let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d, 0];
      let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
      let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

      //second
      let centerPt2 = [xy[0], xy[1], 0.5];
      let angle3 = angle;
      let angle4 = angle + angleStep;
      let vec3 = [Math.cos(angle3 * Math.PI / 180) * d, Math.sin(angle3 * Math.PI / 180) * d, 0];
      let vec4 = [Math.cos(angle4 * Math.PI / 180) * d, Math.sin(angle4 * Math.PI / 180) * d, 0];
      let pt3 = [centerPt2[0] + vec3[0], centerPt2[1] + vec3[1]];
      let pt4 = [centerPt2[0] + vec4[0], centerPt2[1] + vec4[1]];


      // Circles
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3D([xy[0], xy[1], 0, pt1[0], pt1[1], 0, pt2[0], pt2[1], 0]);
      gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
      drawTriangle3D([xy[0], xy[1], 1, pt1[0], pt1[1], 1, pt2[0], pt2[1], 1]);

      // Sides
      gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
      drawTriangle3D([pt1[0], pt1[1], 0, pt2[0], pt2[1], 0, pt4[0], pt4[1], 1]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      drawTriangle3D([pt1[0], pt1[1], 0, pt3[0], pt3[1], 1, pt4[0], pt4[1], 1]);
    }
  }
}