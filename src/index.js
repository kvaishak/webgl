// Function for creating the Shader
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// This program links the two shaders that we have created.
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Main function of our program
function main() {
  const canvas = document.getElementById("game-surface");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL not supported");
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // THE FOLLOWING CODE IS TO FIGURE OUT WHAT DATA THAT WE NEED TO SEND
  // AND HOW.
  var positionBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
  var positions1 = [-0.25, -0.43, 0.25, -0.43, 0.0, 0.43];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW);

  var positionBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
  var positions2 = [0.45, -0.43, 0.95, -0.43, 0.75, 0.43];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);

  // ***** code above this line is initialization code. *****
  // ***** code below this line is rendering code. *****

  // Sets the background color for the canvas.
  gl.clearColor(0.1, 0.85, 0.8, 1.0); // sets the color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clears the canvas and sets the color

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
