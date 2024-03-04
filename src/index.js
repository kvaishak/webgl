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
  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Specify the position data and then send it to the GPU
  var positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // ***** code above this line is initialization code. *****
  // ***** code below this line is rendering code. *****

  // Sets the background color for the canvas.
  gl.clearColor(0.1, 0.85, 0.8, 1.0); // sets the color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clears the canvas and sets the color

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );

  // Enables the attribute for use
  gl.enableVertexAttribArray(positionAttributeLocation);

  //
  // Main Render Loop
  //
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  var primitiveType = gl.TRIANGLES;
  var offset = 0; // How many of the vertex attributes to skip
  var count = 3; // How many of the vertex attributes to use
  gl.drawArrays(primitiveType, offset, count);
}

main();
