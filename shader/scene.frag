precision highp float;
uniform sampler2D videoTexture;
uniform sampler2D capturedVideoTexture;
uniform float     bgColor;
uniform float     isStop;
uniform float     mode;
uniform float     pointShape;
varying vec2 vTexCoord;
varying vec4 vPosition;
const float maxColor = 0.9;
const float minColor = 0.1;

float lengthN(vec2 v, float n) {
  vec2 tmp = pow(abs(v), vec2(n));
  return pow(tmp.x + tmp.y, 1. / n);
}

void main(){
  vec4 video = mix(texture2D(videoTexture, vTexCoord), texture2D(capturedVideoTexture, vTexCoord), isStop);
  float rate = vPosition.z / vPosition.w;
  vec3 color = video.rgb * (maxColor - minColor) + minColor;

  vec2 pointCoord = gl_PointCoord.st * 2. - 1.;
  float circle = pow(length(pointCoord), 3.);
  float star = lengthN(pointCoord, 0.5);
  float shape = mix(1., 1. - mix(circle, star, step(2., pointShape)), pointShape);
  vec4 particleColor = vec4(vec3(1.), mix(1., shape, step(mode, 0.)));

  gl_FragColor = vec4((color + maxColor * (1. - rate) * mix(-1., 1., bgColor)), sqrt(rate)) * particleColor;
}
