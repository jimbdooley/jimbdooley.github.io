roundFinalVert = `precision mediump float;
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
  v_world_norm = vec4(normalize((u_mMat * a_norm).xyz), 0.0);
  v_uv = vec2(0.5, 0.5) + a_pos.xy;
}`;


replaceNeededRoundFinalFrag = `precision mediump float;

uniform samplerCube u_sampler;
uniform samplerCube u_sampler_norm;
uniform vec3 u_data[9];


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
\n#define NUMERICAL_THRESHOLD 0.0001
\n#define SUN_LOC vec3(6.0, 2.0, 0.0)
\n#define BOUNCE_MAX 5
\n#define _x_COS_CRITICAL_ANGLE 0.4166 /* cos(asin(1/refraction_index)) */
\n#define _x_REF_INDEX 1.1
\n#define _COS_CRITICAL_ANGLE 0.74536 /* cos(asin(1/refraction_index)) */
\n#define _REF_INDEX 1.5
\n#define COS_CRITICAL_ANGLE 0.91 /* cos(asin(1/refraction_index)) */
\n#define REF_INDEX 2.417
\n#define TAU 6.2831853
\n#define PI 3.14159265
\n#define GREYNESS 0.0
\n#define FLIP_NORMAL -1.0
\n

---replace---

vec4 vector_plane_intersect(vec3 vp, vec3 vd, vec3 pp, vec3 pn){
  float vectorDotNormal = dot(vd, pn);
  float d = dot(pp - vp, pn) / vectorDotNormal;
  return vec4(vp + d * vd, d);
}

int get_current_side(vec3 p){
  float mx = abs(p.x);
  float my = abs(p.y);
  float mz = abs(p.z);
  int x_cross = int((mx > my) && (mx > mz));
  int y_cross = int(my > mz);
  int pos_x = 1 - int(p.x > 0.0);
  int pos_y = 3 - int(p.y > 0.0);
  int pos_z = 5 -  int(p.z > 0.0);
  return x_cross*pos_x + (1-x_cross)*(y_cross*pos_y + (1-y_cross)*pos_z);
}

vec4 update_rtn(vec3 p, vec3 d, vec3 side, vec3 norm, vec4 rtn){
  vec4 intersect = vector_plane_intersect(p, d, side, norm);
  if( (dot(d, side) > 0.0) && (intersect.w < rtn.w) ) {
    return intersect;
  }
  return rtn;
}



vec3 getCubeMapDirForEnv(vec3 p, vec3 d){
  vec4 rtn = vec4(1.0, 1.0, 1.0, 8.0*ENV_D);
  rtn = update_rtn(p, d, vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(-1.0, 0.0, 0.0), vec3(-1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, -1.0, 0.0), vec3(0.0, -1.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, -1.0), rtn);
  return rtn.xyz;
}

vec3 getCubeMapDirNoSkip(vec3 p, vec3 d){
  vec4 rtn = vec4(1.0, 1.0, 1.0, 8.0*ENV_D);
  rtn = update_rtn(p, d, SQ*vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(-1.0, 0.0, 0.0), vec3(-1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, -1.0, 0.0), vec3(0.0, -1.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, -1.0), rtn);
  return rtn.xyz;
}


vec3 getCubeMapDir(vec3 p, vec3 d){
  d.y = 0.3*d.y;
  int skip = get_current_side(p);
  vec4 rtn = vec4(1.0, 0.0, 1.0, 8.0*ENV_D);
  vec3 side;
  side.x = 1.0 - 2.0*float(skip == 0);
  side.y = 0.0;
  side.z = 0.0;
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.x = -float(skip > 1);
  side.y = float(skip > 2);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.x = 0.0;
  side.y = 1.0 - 2.0*float(skip < 3);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.y = -float(skip > 3);
  side.z = float(skip < 4);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.y = 0.0;
  side.z = 2.0*float(skip == 5) - 1.0;
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  return rtn.xyz;
}

bool will_not_reflect(vec3 _i, vec3 n, float cos_critical_angle){
  vec3 i = normalize(_i);
  float cos_th = dot(i, n) / (sqrt(dot(i, i))*sqrt(dot(n, n)));
  return cos_th > cos_critical_angle;
}

vec3 bottom_diamond_normal(vec3 _dir){
    float th = PI + atan(_dir.y , _dir.x);
    int th_int = int(th*16.0/TAU);
    th = float(th_int);
    th = (TAU/16.0)*(0.5 + th);
    return vec3(cos(th), sin(th), 0.3);
}

vec3 top_diamond_normal(vec3 dir){
    float box_pct = 0.6;
    float box_test = float(dir.x < box_pct)*float(dir.x > -box_pct)*float(dir.y < box_pct)*float(dir.y > -box_pct);
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

vec3 mid_diamond_normal(vec3 dir){
    float th = PI + atan(dir.y , dir.x);
    int th_int = int(th*16.0/TAU);
    th = float(th_int);
    th = (TAU/16.0)*(0.5 + th);
    return vec3(cos(th), sin(th), -0.2);
}


void set_color(vec3 model_pos, vec3 model_dir, float distance_traveled){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDirForEnv(world_pos/ENV_D, world_dir/ENV_D);



  float bounce0 = float(0.99 < -reflect(u_data[1], v_norm).z);
  float bounce1 = float(0.99 < -reflect(u_data[2], v_norm).z);
  float bounce_magnitude = bounce0 + bounce1;
  bounce_magnitude = 0.0;

  /*gl_FragColor = bounce_magnitude + GREYNESS + (1.0-GREYNESS)*textureCube(u_sampler, world_intersect);
  return;*/

  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  vec3 r_exit = vec3(0.01 +world_intersect.x, 0.0 + world_intersect.y, 0.0 + world_intersect.z);
  vec3 g_exit = vec3(0.0 +world_intersect.x, 0.01 + world_intersect.y, 0.0 + world_intersect.z);
  vec3 b_exit = vec3(0.0 +world_intersect.x, 0.0 + world_intersect.y, 0.01 + world_intersect.z);


  gl_FragColor.r = bounce_magnitude + GREYNESS + u_data[0].x*(1.0-GREYNESS)*textureCube(u_sampler, r_exit).r;
  gl_FragColor.g = bounce_magnitude + GREYNESS + u_data[0].y*(1.0-GREYNESS)*textureCube(u_sampler, g_exit).g;
  gl_FragColor.b = bounce_magnitude + GREYNESS + u_data[0].z*(1.0-GREYNESS)*textureCube(u_sampler, b_exit).b;

}


void main() {
  float light_ratio = 0.3;
  float light = light_ratio + (1.0 - light_ratio) * v_world_norm.z;
  vec3 color = vec3(v_uv, 0.0);
  gl_FragColor = vec4(light * color, 1.0);


  float distance = 0.0;
  vec3 world_curr_pos, world_intersect;
  vec3 world_curr_dir = refract(normalize(v_pos-CAM_LOC), v_norm, 1.0/REF_INDEX);
  world_curr_dir = BLOCK_ENTRY*world_curr_dir + (1.0-BLOCK_ENTRY) * refract(normalize(v_pos-CAM_LOC), normalize((v_mMat * vec4(0.0, 0.0, 1.0, 0.0)).xyz), 1.0/REF_INDEX);
  if(BLOCK_ENTRY < 0.5){
    if(v_norm_orig.z < 0.99999){
      //gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      //return;
    }
  }
  vec3 model_curr_dir = (v_mMat_inv*vec4(world_curr_dir, 0.0)).xyz;
  vec3 model_intersect = getCubeMapDirNoSkip(v_pos_orig, model_curr_dir);
  vec3 model_curr_pos = model_intersect;
  distance = distance + length(model_intersect-model_curr_pos);
  vec3 model_normal = get_normal(model_intersect);

  if( will_not_reflect(model_curr_dir, model_normal, COS_CRITICAL_ANGLE)){
    model_curr_dir = refract(normalize(model_curr_dir), FLIP_NORMAL*model_normal, REF_INDEX);
    set_color(model_curr_pos, model_curr_dir, clamp(0.25*distance, 0.0, 0.5));
    return;
  }

  for(int i = 1; i < BOUNCE_MAX-1; i++){
    model_curr_dir = reflect(model_curr_dir, model_normal);
    model_curr_pos = model_intersect;
    model_intersect = getCubeMapDir(model_curr_pos, model_curr_dir);
    distance = distance + length(model_intersect-model_curr_pos);
    model_normal = get_normal(model_intersect);
    /*if( will_not_reflect(model_curr_dir, model_normal, COS_CRITICAL_ANGLE)){
      set_color(model_curr_pos, model_curr_dir);
      return;
    }*/
  }

  set_color(model_curr_pos, model_curr_dir, clamp(0.5*distance, 0.0, 0.5));
}`;
function makeRoundReplacements(){
  roundFinalFrag = replaceNeededRoundFinalFrag.replace("---replace---",  round_get_normal_func)
  //roundFinalFrag = replaceNeededRoundFinalFrag.replace("---replace---",  "vec3 get_normal(vec3 dir){return 2.0*(textureCube(u_sampler_norm, dir).xyz-0.5);}")

}
makeRoundReplacements();

function makeRoundFinal(){
  const rtn = {}
  setupShader(round_gl, rtn, roundFinalVert, roundFinalFrag);
  rtn.locs = {
    u_pvmMat:round_gl.getUniformLocation(rtn.program, "u_pvmMat"),
    u_mMat:round_gl.getUniformLocation(rtn.program, "u_mMat"),
    u_sampler:round_gl.getUniformLocation(rtn.program, "u_sampler"),
    u_sampler_norm:round_gl.getUniformLocation(rtn.program, "u_sampler_norm"),
    u_data:round_gl.getUniformLocation(rtn.program, "u_data"),
    a_pos:round_gl.getAttribLocation(rtn.program, "a_pos"),
    a_norm:round_gl.getAttribLocation(rtn.program, "a_norm")
  }
  rtn.use = (_pvmMat, _mMat, _obj, _texture, _normalTexture)=>{

    round_gl.useProgram(rtn.program);

    round_gl.uniformMatrix4fv(rtn.locs.u_pvmMat, false, _pvmMat);
    round_gl.uniformMatrix4fv(rtn.locs.u_mMat, false, _mMat);
    round_gl.uniform3fv(rtn.locs.u_data, [1,1,1,0,0,-1, 0, 0, -1]);

    round_gl.bindBuffer(round_gl.ARRAY_BUFFER, _obj.pos);
    round_gl.enableVertexAttribArray(rtn.locs.a_pos);
    round_gl.vertexAttribPointer(rtn.locs.a_pos, 4, round_gl.FLOAT, 0, 0, 0);
    round_gl.bindBuffer(round_gl.ARRAY_BUFFER, _obj.norm);
    round_gl.enableVertexAttribArray(rtn.locs.a_norm);
    round_gl.vertexAttribPointer(rtn.locs.a_norm, 4, round_gl.FLOAT, 0, 0, 0);
    round_gl.bindBuffer(round_gl.ELEMENT_ARRAY_BUFFER, _obj.ind);

    round_gl.activeTexture(round_gl.TEXTURE0);
    round_gl.bindTexture(round_gl.TEXTURE_CUBE_MAP, _texture);
    round_gl.uniform1i(rtn.locs.u_sampler, 0);
    round_gl.activeTexture(round_gl.TEXTURE1);
    round_gl.bindTexture(round_gl.TEXTURE_CUBE_MAP, _normalTexture);
    round_gl.uniform1i(rtn.locs.u_sampler_norm, 1);

    round_gl.drawElements(round_gl.TRIANGLES, _obj.indArr.length, round_gl.UNSIGNED_SHORT, 0);
  }
  return rtn;
}
roundFinal = makeRoundFinal();
