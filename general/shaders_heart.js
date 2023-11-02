const gemVert = `
precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_mMat_inv;
uniform mat4 u_mMat_cen;
uniform mat4 u_pvmMat;
varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;


void main() {
    gl_Position = u_pvmMat * (a_pos);
    v_mMat = u_mMat_cen;
    v_norm = normalize((v_mMat * a_norm).xyz);
    v_pos = (v_mMat * a_pos).xyz;
    v_pos_orig = a_pos.xyz;
    v_mMat_inv = u_mMat_inv;
}
`

const shiftingVert = `
precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec4 a_ave;
uniform mat4 u_mMat_inv;
uniform mat4 u_mMat_cen;
uniform mat4 u_pvMat;
uniform mat4 u_mMat_trans;
uniform vec4 u_shift_data[1]; // x: dOut, y: b, z: 0: neither, 1: above, 2: below
varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;

#define TAU 6.28318530718
#define THINNESS_FACTOR 2.5
#define m -1.0
#define sinThZ 0.70710678118
#define cosThZ 0.70710678118
#define aboveThreshold 0.05

mat4 get_spin(float th) {
  mat4 pre = mat4(1.0);
  pre[0][0] = cosThZ;
  pre[0][1] = -sinThZ;
  pre[1][0] = sinThZ;
  pre[1][1] = cosThZ;
  mat4 post = mat4(1.0);
  post[0][0] = cosThZ;
  post[0][1] = sinThZ;
  post[1][0] = -sinThZ;
  post[1][1] = cosThZ;
  

  float costh = cos(th);
  float sinth = sin(th);
  mat4 rtn = mat4(1.0);
  rtn[0][0] = costh;
  rtn[0][2] = sinth;
  rtn[2][0] = -sinth;
  rtn[2][2] = costh;
  return pre * rtn * post;
}

void main() {
    v_mMat = u_mMat_cen;
    v_norm = normalize((v_mMat * a_norm).xyz);
    v_pos = (v_mMat * a_pos).xyz;
    v_pos_orig = a_pos.xyz;
    v_mMat_inv = u_mMat_inv;


    float balloon = 1.0 + u_shift_data[0].x;
    
    vec4 rot_cen = u_mMat_cen * a_ave * balloon;

    float dist_from_rot_line = (rot_cen.y - (m*rot_cen.x + u_shift_data[0].y*balloon)) / balloon;
    dist_from_rot_line = THINNESS_FACTOR * dist_from_rot_line;
    dist_from_rot_line = min(1.0, dist_from_rot_line);
    dist_from_rot_line = max(-1.0, dist_from_rot_line);
    float dBalloon = 0.4*(1.0 - abs(dist_from_rot_line));
    float th = (0.5 * dist_from_rot_line + 0.5) * TAU;
    mat4 spin = get_spin(th);

    float above = float(dist_from_rot_line > -aboveThreshold);
    float below = float(dist_from_rot_line < aboveThreshold);
    float decider = float(1.0==u_shift_data[0].z)*above + float(2.0==u_shift_data[0].z)*below;
    vec4 pos = (a_pos + u_shift_data[0].x * a_ave + dBalloon * a_ave);
    vec4 showPos = u_pvMat * u_mMat_trans * spin * u_mMat_cen * pos;
    gl_Position = decider*showPos + (1.0-decider)*vec4(-1000.0);
}
`

var diamVertCode = `
precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying vec3 v_norm_orig;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;
varying vec4 v_world_norm;
varying vec2 v_uv;

mat4 inverse(mat4 M){
  float a = M[0][0];
  float b = M[1][0];
  float c = M[2][0];
  float d = M[0][1];
  float e = M[1][1];
  float f = M[2][1];
  float g = M[0][2];
  float h = M[1][2];
  float i = M[2][2];
  float det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
  mat4 M_inv;
  M_inv[0][0] = ( e*i - f*h)/det;
  M_inv[0][1] = (-d*i + g*f)/det;
  M_inv[0][2] = ( d*h - e*g)/det;
  M_inv[1][0] = (-b*i + h*c)/det;
  M_inv[1][1] = ( a*i - c*g)/det;
  M_inv[1][2] = (-a*h + b*g)/det;
  M_inv[2][0] = ( b*f - e*c)/det;
  M_inv[2][1] = (-a*f + d*c)/det;
  M_inv[2][2] = ( a*e - b*d)/det;

  M_inv[0][3] = 0.0;
  M_inv[1][3] = 0.0;
  M_inv[2][3] = 0.0;
  M_inv[3][0] = -M[3][0];
  M_inv[3][1] = -M[3][1];
  M_inv[3][2] = -M[3][2];
  M_inv[3][3] = 1.0;

  return M_inv;
}


void main() {
  gl_Position = u_pvmMat * a_pos;
  v_norm = normalize((u_mMat * a_norm).xyz);
  v_pos = (u_mMat * a_pos).xyz;
  v_pos_orig = a_pos.xyz;
  v_norm_orig = a_norm.xyz;
  v_mMat = u_mMat;
  v_mMat_inv = inverse(u_mMat);
  v_world_norm = u_mMat * a_norm;
  v_uv = vec2(0.5, 0.5) + a_pos.xy;
}`;

var diamFragCode = `
precision mediump float;

uniform samplerCube u_sampler;

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying vec3 v_norm_orig;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;
varying vec4 v_world_norm;
varying vec2 v_uv;

\n#define CAM_LOC vec3(0.0, 0.0, 5.0)
\n#define ENV_D 3.5
\n#define NUMERICAL_THRESHOLD 0.001
\n#define SUN_LOC vec3(6.0, 2.0, 0.0)
\n#define BOUNCE_MAX 5
\n#define COS_CRITICAL_ANGLE 0.91
\n#define TAU 6.2831853
\n#define PI 3.14159265
\n#define GREYNESS 0.2
\n


vec4 vector_plane_intersect(vec3 vp, vec3 vd, vec3 pp, vec3 pn){
  float vectorDotNormal = dot(vd, pn);
  if (vectorDotNormal == 0.0) return vec4(1.0, 1.0, 1.0, -10000.0);
  float d = dot(pp - vp, pn) / vectorDotNormal;
  return vec4(vp + d * vd, d);
}

int get_current_side(vec3 p){
  float mx = abs(p.x);
  float my = abs(p.y);
  float mz = abs(p.z);
  int x_cross = int((mx > my) &amp;&amp; (mx > mz));
  int y_cross = int(my > mz);
  int pos_x = 1 - int(p.x > 0.0);
  int pos_y = 3 - int(p.y > 0.0);
  int pos_z = 5 -  int(p.z > 0.0);
  return x_cross*pos_x + (1-x_cross)*(y_cross*pos_y + (1-y_cross)*pos_z);
}

vec4 update_rtn(vec3 p, vec3 d, vec3 side, vec4 rtn){
  vec4 intersect = vector_plane_intersect(p, d, side, side);
  if( (dot(d, side) > 0.0) &amp;&amp; (intersect.w &lt; rtn.w) ) {
    return intersect;
  }
  return rtn;
}


vec4 update_rtn_neg_z(vec3 p, vec3 d, vec3 side, vec4 rtn){
  vec4 intersect = vector_plane_intersect(p, d, side, side);
  if( (intersect.w >= NUMERICAL_THRESHOLD) &amp;&amp; (intersect.w &lt; rtn.w) ) {
    float th = atan(intersect.y , intersect.x);
    int th_int = int(th*16.0/TAU);
    th = float(th_int);
    float mag = sqrt(intersect.x*intersect.x + intersect.y * intersect.y);
    th = (TAU/16.0)*(-0.5 + float(th));
    intersect.x = cos(th);
    intersect.y = sin(th);
    return intersect;
  }
  return rtn;
}

vec3 getCubeMapDir(vec3 p, vec3 d){
  vec4 rtn = vec4(1.0, 0.0, 1.0, 8.0*ENV_D);
  int skip = get_current_side(p);
  if(skip != 0) rtn = update_rtn(p, d, vec3(1.0, 0.0, 0.0), rtn);
  if(skip != 1) rtn = update_rtn(p, d, vec3(-1.0, 0.0, 0.0), rtn);
  if(skip != 2) rtn = update_rtn(p, d, vec3(0.0, 1.0, 0.0), rtn);
  if(skip != 3) rtn = update_rtn(p, d, vec3(0.0, -1.0, 0.0), rtn);
  if(skip != 4) rtn = update_rtn(p, d, vec3(0.0, 0.0, 1.0), rtn);
  if(skip != 5) rtn = update_rtn(p, d, vec3(0.0, 0.0, -1.0), rtn);
  return rtn.xyz;
}


bool will_not_reflect(vec3 _i, vec3 n, float cos_critical_angle){
  vec3 i = normalize(_i);
  float cos_th = dot(i, n) / (sqrt(dot(i, i))*sqrt(dot(n, n)));
  return cos_th &gt; cos_critical_angle;
}

vec3 get_normal(vec3 dir){
  if(dir.z &lt; 0.6){
    float th = PI + atan(dir.y , dir.x);
    int th_int = int(th*16.0/TAU);
    th = float(th_int);
    th = (TAU/16.0)*(0.5 + th);
    dir.x = cos(th);
    dir.y = sin(th);
    dir.z = 0.3;
  }
  else if(v_norm_orig.z < -0.9){
    float box_pct = 0.6;
    float box_test = float(dir.x &lt; box_pct)*float(dir.x > -box_pct)*float(dir.y &lt; box_pct)*float(dir.y > -box_pct);
    float top_right = float(0.6*(1.414) > (dir.x+dir.y));
    float top_left = float(0.6*(1.414) > (-dir.x+dir.y));
    float bot_right = float(0.6*(1.414) > (dir.x-dir.y));
    float bot_left = float(0.6*(1.414) > (-dir.x-dir.y));
    box_test = top_right*top_left*bot_right*bot_left*box_test;


    float th = PI + atan(dir.y, dir.x);
    int th_int = int(th*16.0/TAU);
    th = (TAU/16.0)*float(th_int);
    vec3 outside_box = vec3(cos(th), sin(th), -0.2);

    return normalize((1.0 - box_test)*outside_box + box_test*vec3(0.0, 0.0, -1.0));
  }
  else {
    float th = PI + atan(dir.y , dir.x);
    int th_int = int(th*16.0/TAU);
    th = float(th_int);
    th = (TAU/16.0)*(0.5 + th);
    dir.x = cos(th);
    dir.y = sin(th);
    dir.z = -0.2;
  }
  return normalize(dir);
}

void set_color(vec3 model_pos, vec3 model_dir){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDir(world_pos/ENV_D, world_dir/ENV_D);
  gl_FragColor = textureCube(u_sampler, world_intersect);
/*
  vec3 dr = vec3(1.01, 1.0, 1.0);
  vec3 dg = vec3(1.0, 1.01, 1.0);
  vec3 db = vec3(1.0, 1.0, 1.01);

  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  vec3 r_exit = vec3(dr.x+world_intersect.x, dr.y + world_intersect.y, dr.z + world_intersect.z);
  vec3 g_exit = vec3(dg.x+world_intersect.x, dg.y + world_intersect.y, dg.z + world_intersect.z);
  vec3 b_exit = vec3(db.x+world_intersect.x, db.y + world_intersect.y, db.z + world_intersect.z);

  vec3 sun_loc = vec3(5.0, 2.0, 2.0);
  vec3 sunlight_bounce = normalize(reflect(normalize(v_pos-sun_loc), v_norm));
  vec3 pos_to_camera = normalize(CAM_LOC - v_pos);
  float bounce_magnitude = pow(clamp(dot(sunlight_bounce, pos_to_camera), 0.0, 1.0), 2.0);


  gl_FragColor.r = bounce_magnitude + GREYNESS + (1.0-GREYNESS)*textureCube(u_sampler, r_exit).r;
  gl_FragColor.g = bounce_magnitude + GREYNESS + 1.1*(1.0-GREYNESS)*textureCube(u_sampler, g_exit).g;
  gl_FragColor.b = bounce_magnitude + GREYNESS + (1.0-GREYNESS)*textureCube(u_sampler, b_exit).b;
  */
}


void main() {
  float light_ratio = 0.3;
  float light = light_ratio + (1.0 - light_ratio) * v_world_norm.z;
  vec3 color = vec3(v_uv, 0.0);
  gl_FragColor = vec4(light * color, 1.0);


  vec3 world_curr_pos, world_intersect;
  vec3 world_curr_dir = refract(normalize(v_pos-CAM_LOC), v_norm, 1.0/2.417);
  vec3 model_curr_dir = (v_mMat_inv*vec4(world_curr_dir, 0.0)).xyz;
  vec3 model_curr_pos = v_pos_orig;
  vec3 model_intersect = getCubeMapDir(model_curr_pos, model_curr_dir);
  vec3 model_normal = get_normal(model_intersect);

  // gl_FragColor = textureCube(u_sampler, model_intersect);
  // return;




  if( will_not_reflect(model_curr_dir, model_normal, COS_CRITICAL_ANGLE)){
    set_color(model_curr_pos, model_curr_dir);
    return;
  }

  for(int i = 1; i &lt; BOUNCE_MAX-1; i++){
    model_curr_dir = reflect(model_curr_dir, model_normal);
    model_curr_pos = model_intersect;
    model_intersect = getCubeMapDir(model_curr_pos, model_curr_dir);
    model_normal = get_normal(model_intersect);
    if( will_not_reflect(model_curr_dir, model_normal, COS_CRITICAL_ANGLE)){
      set_color(model_curr_pos, model_curr_dir);
      return;
    }
  }

  set_color(model_curr_pos, model_curr_dir);
}`;


var minVertCode = `
precision mediump float;

attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec4 v_world_norm;
varying vec4 v_object_pos;

void main() {
  gl_Position = u_pvmMat * a_pos;
  v_world_norm = vec4(normalize((u_mMat * a_norm).xyz),0.0);
  v_object_pos = a_pos;
}`;

var minFragCode = `
precision mediump float;
varying vec4 v_world_norm;
varying vec4 v_object_pos;
uniform samplerCube u_sampler;

void main(){
  vec3 color = textureCube(u_sampler, v_object_pos.xyz).xyz;
  // vec3 color = vec3(0.0, 0.0, 0.9);
  float light = 0.4 + 0.6*v_world_norm.z;
  gl_FragColor = vec4(light*color, 1.0);
}`;

const minShader = {}
const gl = heart_gl
setupShader(gl, minShader, minVertCode, minFragCode);
minShader.locs = {
  u_pvmMat:gl.getUniformLocation(minShader.program, "u_pvmMat"),
  u_mMat:gl.getUniformLocation(minShader.program, "u_mMat"),
  u_sampler:gl.getUniformLocation(minShader.program, "u_sampler"),
  a_pos:gl.getAttribLocation(minShader.program, "a_pos"),
  a_norm:gl.getAttribLocation(minShader.program, "a_norm")
}
minShader.use = (_pvmMat, _mMat, _obj, _texture)=>{

  gl.useProgram(minShader.program);

  gl.uniformMatrix4fv(minShader.locs.u_pvmMat, false, _pvmMat);
  gl.uniformMatrix4fv(minShader.locs.u_mMat, false, _mMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, _obj.pos);
  gl.enableVertexAttribArray(minShader.locs.a_pos);
  gl.vertexAttribPointer(minShader.locs.a_pos, 4, gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, _obj.norm);
  gl.enableVertexAttribArray(minShader.locs.a_norm);
  gl.vertexAttribPointer(minShader.locs.a_norm, 4, gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _obj.ind);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
  gl.uniform1i(minShader.locs.u_sampler, 0);

  gl.drawElements(gl.TRIANGLES, _obj.indArr.length, gl.UNSIGNED_SHORT, 0);
}

shapeTestVert = `
precision mediump float;

attribute vec4 a_pos;
attribute vec4 a_norm;

uniform mat4 u_pvmMat;
uniform mat4 u_mMat;

varying vec4 v_world_norm;

void main() {
gl_Position = u_pvmMat * a_pos;
v_world_norm = vec4(normalize((u_mMat * a_norm).xyz), 0.0);
}`;

shapeTestFrag = `
precision mediump float;

varying vec4 v_world_norm;

void main() {
float light_ratio = 0.05;
float light = light_ratio + (1.0 - light_ratio) * v_world_norm.z;
gl_FragColor = vec4(light * vec3(0.7, 0.7, 0.7), 1.0);
}`;

const shapeTest = {}
setupShader(gl, shapeTest, shapeTestVert, shapeTestFrag);
shapeTest.locs = {
  u_pvmMat:gl.getUniformLocation(shapeTest.program, "u_pvmMat"),
  u_mMat:gl.getUniformLocation(shapeTest.program, "u_mMat"),
  a_pos:gl.getAttribLocation(shapeTest.program, "a_pos"),
  a_norm:gl.getAttribLocation(shapeTest.program, "a_norm")
}
shapeTest.use = (_pvmMat, _mMat, _obj)=>{

  gl.useProgram(shapeTest.program);

  gl.uniformMatrix4fv(shapeTest.locs.u_pvmMat, false, _pvmMat);
  gl.uniformMatrix4fv(shapeTest.locs.u_mMat, false, _mMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, _obj.pos);
  gl.enableVertexAttribArray(shapeTest.locs.a_pos);
  gl.vertexAttribPointer(shapeTest.locs.a_pos, 4, gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, _obj.norm);
  gl.enableVertexAttribArray(shapeTest.locs.a_norm);
  gl.vertexAttribPointer(shapeTest.locs.a_norm, 4, gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _obj.ind);


  gl.drawElements(gl.TRIANGLES, _obj.indArr.length, gl.UNSIGNED_SHORT, 0);
}
