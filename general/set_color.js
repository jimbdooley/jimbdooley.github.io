consts = `
precision mediump float;
uniform samplerCube u_sampler;
uniform vec4 u_color[1];
uniform vec3 u_data[3]; // y: time, for plasma

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;


#define CAM_LOC vec3(0.0, 0.0, 5.0)
#define ENV_D 15.5
#define NUMERICAL_THRESHOLD 0.0001
#define SUN_LOC vec3(0.457496, 0.457496, 0.762493)
#define BOUNCE_MAX 5
#define _x_COS_CRITICAL_ANGLE 0.4166 /* cos(asin(1/refraction_index)) */
#define _x_REF_INDEX 1.1
#define _COS_CRITICAL_ANGLE 0.74536 /* cos(asin(1/refraction_index)) */
#define _REF_INDEX 1.5
#define COS_CRITICAL_ANGLE 0.91 /* cos(asin(1/refraction_index)) */
#define REF_INDEX 2.417
#define TAU 6.2831853
#define PI 3.14159265
#define GREYNESS 0.0
#define FLIP_NORMAL -1.0

`;

constsLightning = `
precision mediump float;
uniform samplerCube u_sampler;
uniform vec4 u_color[1];
uniform vec3 u_data[3];

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;


#define CAM_LOC vec3(0.0, 0.0, 5.0)
#define ENV_D 15.5
#define NUMERICAL_THRESHOLD 0.0001
#define SUN_LOC vec3(0.457496, 0.457496, 0.762493)
#define BOUNCE_MAX 5
#define _x_COS_CRITICAL_ANGLE 0.4166 /* cos(asin(1/refraction_index)) */
#define _x_REF_INDEX 1.1
#define _COS_CRITICAL_ANGLE 0.74536 /* cos(asin(1/refraction_index)) */
#define _REF_INDEX 1.5
#define COS_CRITICAL_ANGLE 0.91 /* cos(asin(1/refraction_index)) */
#define REF_INDEX 2.417
#define TAU 6.2831853
#define PI 3.14159265
#define GREYNESS 0.0
#define FLIP_NORMAL -1.0

`;


constsDuo = `
precision mediump float;
uniform samplerCube u_sampler;
uniform vec4 u_color1[1];
uniform vec4 u_color2[1]; // w: xyId
uniform vec4 u_data2[1]; // consts for x = a*y^3 + b*y^2 + c*y + d
uniform vec3 u_data[3]; // [0].x: xyId

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;


#define CAM_LOC vec3(0.0, 0.0, 5.0)
#define ENV_D 15.5
#define NUMERICAL_THRESHOLD 0.0001
#define SUN_LOC vec3(0.457496, 0.457496, 0.762493)
#define BOUNCE_MAX 5
#define _x_COS_CRITICAL_ANGLE 0.4166 /* cos(asin(1/refraction_index)) */
#define _x_REF_INDEX 1.1
#define _COS_CRITICAL_ANGLE 0.74536 /* cos(asin(1/refraction_index)) */
#define _REF_INDEX 1.5
#define COS_CRITICAL_ANGLE 0.91 /* cos(asin(1/refraction_index)) */
#define REF_INDEX 2.417
#define TAU 6.2831853
#define PI 3.14159265
#define GREYNESS 0.0
#define FLIP_NORMAL -1.0

`;

constsRnbw = `
precision mediump float;
uniform samplerCube u_sampler;
uniform vec3 u_data[3];
uniform vec4 u_rnbw_data[1]; // x: m, y: xyId, z: bw, w: _nothing_

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;


#define CAM_LOC vec3(0.0, 0.0, 5.0)
#define ENV_D 15.5
#define NUMERICAL_THRESHOLD 0.0001
#define SUN_LOC vec3(0.457496, 0.457496, 0.762493)
#define BOUNCE_MAX 5
#define _x_COS_CRITICAL_ANGLE 0.4166 /* cos(asin(1/refraction_index)) */
#define _x_REF_INDEX 1.1
#define _COS_CRITICAL_ANGLE 0.74536 /* cos(asin(1/refraction_index)) */
#define _REF_INDEX 1.5
#define COS_CRITICAL_ANGLE 0.91 /* cos(asin(1/refraction_index)) */
#define REF_INDEX 2.417
#define TAU 6.2831853
#define PI 3.14159265
#define GREYNESS 0.0
#define FLIP_NORMAL -1.0
#define AA vec3(1.0, 0.0, 0.0)
#define BB vec3(1.0, 0.5, 0.0)
#define CC vec3(1.0, 1.0, 0.0)
#define DD vec3(0.0, 1.0, 0.0)
#define EE vec3(0.0, 0.0, 1.0)
#define FF vec3(0.7, 0.0, 0.8)

float bw = u_rnbw_data[0].z;
float rn = 1.0 - bw;
vec3 A = bw*vec3(1.0) + rn*AA;
vec3 B = bw*vec3(0.0) + rn*BB;
vec3 C = bw*vec3(1.0) + rn*CC;
vec3 D = bw*vec3(0.0) + rn*DD;
vec3 E = bw*vec3(1.0) + rn*EE;
vec3 F = bw*vec3(0.0) + rn*FF;

`;

main_func_txt = `

void main() {
  vec3 world_curr_dir = refract(normalize(v_pos-CAM_LOC), v_norm, 1.0/REF_INDEX);
  world_curr_dir = BLOCK_ENTRY*world_curr_dir + (1.0-BLOCK_ENTRY) * vec3(0.0, 0.0, -1.0);

  vec3 model_curr_dir = (v_mMat_inv*vec4(world_curr_dir, 0.0)).xyz;
  vec3 model_intersect = getCubeMapDirNoSkip(v_pos_orig, model_curr_dir);
  float distance_traveled = distance(model_intersect, v_pos_orig);
  vec3 model_normal = get_normal(model_intersect);


  vec3 temp;
  model_curr_dir = reflect(model_curr_dir, model_normal);
  temp = getCubeMapDir(model_intersect, model_curr_dir);
  distance_traveled = distance_traveled + distance(temp, model_intersect);
  model_intersect = temp;
  model_normal = get_normal(model_intersect);

  model_curr_dir = reflect(model_curr_dir, model_normal);
  temp = getCubeMapDir(model_intersect, model_curr_dir);
  distance_traveled = distance_traveled + distance(temp, model_intersect);
  model_intersect = temp;
  model_normal = get_normal(model_intersect);


  set_color(model_intersect, model_curr_dir, distance_traveled, (v_mMat * vec4(model_normal, 1.0)).xyz);
}
`;

set_color_func_text = `
void set_color(vec3 model_pos, vec3 model_dir, float _distance, vec3 exit_norm){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDirForEnv(world_pos/ENV_D, world_dir/ENV_D);

  float threshold = 0.96;
  float bounce2 = -reflect(u_data[1], v_norm).z;
  float bounce3 = -reflect(u_data[2], v_norm).z;

  float b_bounce2 = float(threshold < bounce2);
  float b_bounce3 = float(threshold < bounce3);

  float bounce_c = -threshold;
  bounce_c = bounce_c + b_bounce2*bounce2;
  bounce_c = bounce_c + b_bounce3*bounce3;

  float any_bounce = min(1.0, b_bounce2 + b_bounce3);
  float bounce_magnitude = any_bounce*(0.7 + 0.7*bounce_c/(1.0-threshold));
  
  float r = textureCube(u_sampler, vec3(0.01 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  float g = textureCube(u_sampler, vec3(0.03 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  float b = textureCube(u_sampler, vec3(0.04 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  
  vec3 glassy = vec3(1.0);
  glassy.r = bounce_magnitude + u_color[0].x*r;
  glassy.g = bounce_magnitude + u_color[0].y*g;
  glassy.b = bounce_magnitude + 1.1*u_color[0].z*b;
  
  float solid = u_color[0].w;
  vec3 solidColor = bounce_magnitude + u_color[0].xyz * (0.3 + 0.7*dot(v_norm.xyz, SUN_LOC));
  gl_FragColor = vec4((1.0-solid)*glassy + solid*solidColor, 1.0); 
}
`;


set_color_func_duo = `
#define blurW 0.07
void set_color(vec3 model_pos, vec3 model_dir, float _distance, vec3 exit_norm){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDirForEnv(world_pos/ENV_D, world_dir/ENV_D);

  float threshold = 0.96;
  float bounce2 = -reflect(u_data[1], v_norm).z;
  float bounce3 = -reflect(u_data[2], v_norm).z;

  float b_bounce2 = float(threshold < bounce2);
  float b_bounce3 = float(threshold < bounce3);

  float bounce_c = -threshold;
  bounce_c = bounce_c + b_bounce2*bounce2;
  bounce_c = bounce_c + b_bounce3*bounce3;

  float any_bounce = min(1.0, b_bounce2 + b_bounce3);
  float bounce_magnitude = any_bounce*(0.7 + 0.7*bounce_c/(1.0-threshold));
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  float r = textureCube(u_sampler, world_intersect).r;

  float xz = float(u_data[0].x == 0.0);
  float yx = float(u_data[0].x == 1.0);
  float sX = yx * v_pos_orig.y + xz * v_pos_orig.x;
  float sY = yx * v_pos_orig.x + xz * v_pos_orig.z;

  float cutoffY = u_data2[0].x*sX*sX*sX + u_data2[0].y*sX*sX + u_data2[0].z*sX + u_data2[0].w;
  
  float cutoff = float(sY < cutoffY);
  float leftCutoff = cutoff * float(cutoffY - sY < blurW);
  float rightCutoff = (1.0 - cutoff) * float(cutoffY - sY > -blurW);

  float lr = leftCutoff+rightCutoff;
  float lrR = 0.5 * (cutoffY - sY + blurW) / (blurW);
  float leftR = lr*lrR + (1.0-lr)*float(cutoffY - sY > -blurW);

  
  float lighting = 0.3 + 0.7*dot(v_norm, SUN_LOC);
  float solid1 = u_color1[0].w;
  float solid2 = u_color2[0].w;
  vec3 color1 = (1.0-solid1)*r*u_color1[0].xyz + solid1*u_color1[0].xyz*lighting;
  vec3 color2 = (1.0-solid2)*r*u_color2[0].xyz + solid2*u_color2[0].xyz*lighting;
  gl_FragColor = bounce_magnitude + vec4(leftR*color1 + (1.0-leftR)*color2, 1.0);

}
`;


set_color_func_text_rnbw = `
void set_color(vec3 model_pos, vec3 model_dir, float _distance, vec3 exit_norm){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDirForEnv(world_pos/ENV_D, world_dir/ENV_D);

  float threshold = 0.96;
  float bounce2 = -reflect(u_data[1], v_norm).z;
  float bounce3 = -reflect(u_data[2], v_norm).z;

  float b_bounce2 = float(threshold < bounce2);
  float b_bounce3 = float(threshold < bounce3);

  float bounce_c = -threshold;
  bounce_c = bounce_c + b_bounce2*bounce2;
  bounce_c = bounce_c + b_bounce3*bounce3;

  float any_bounce = min(1.0, b_bounce2 + b_bounce3);
  float bounce_magnitude = any_bounce*(0.7 + 0.7*bounce_c/(1.0-threshold));
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  float rgb = textureCube(u_sampler, world_intersect).r;
  
  float dFactor = 0.21;
  float distRLimit = 0.57;

  float rSm = 0.0;
  float m = u_rnbw_data[0].x;
  float sqrt_1_mm = sqrt(1.0+m*m);
  float db = dFactor * sqrt_1_mm;
  float dbInv = 1.0 / db;
  float bb = 3.5*db;
  float distR = 1.0;
  float xy = float(u_rnbw_data[0].y == 0.0);
  float xz = float(u_rnbw_data[0].y == 1.0);
  float lineX = xy*v_pos_orig.x + xz*v_pos_orig.x;
  float lineY = xy*v_pos_orig.y + xz*v_pos_orig.z;
  float r0 = float(lineY > m*lineX + bb);
  rSm += r0;
  distR = (1.0-r0)*distR + r0*(lineY- m*lineX - bb)*dbInv;
  float notr0 = 1.0 - rSm;
  bb -= db;
  float r1 = notr0 * float(lineY > m*lineX + bb);
  rSm += r1;
  distR = (1.0-r1)*distR + r1*(lineY- m*lineX - bb)*dbInv;
  float notr01 = 1.0 - rSm;
  bb -= db;
  float r2 = notr01 * float(lineY > m*lineX + bb);
  rSm += r2;
  distR = (1.0-r2)*distR + r2*(lineY- m*lineX - bb)*dbInv;
  float notr012 = 1.0 - rSm;
  bb -= db;
  float r3 = notr012 * float(lineY > m*lineX + bb);
  rSm += r3;
  distR = (1.0-r3)*distR + r3*(lineY- m*lineX - bb)*dbInv;
  float notr0123 = 1.0 - rSm;
  bb -= db;
  float r4 = notr0123 * float(lineY > m*lineX + bb);
  rSm += r4;
  distR = (1.0-r4)*distR + r4*(lineY- m*lineX - bb)*dbInv;
  float notr01234 = 1.0 - rSm;
  bb -= db;
  float r5 = notr01234 * float(lineY > m*lineX + bb);
  rSm += r5;
  distR = (1.0-r5)*distR + r5*(lineY- m*lineX - bb)*dbInv;
  float notr012345 = 1.0 - rSm;
  bb -= db;
  float r6 = notr012345 * float(lineY > m*lineX + bb);
  rSm += r6;
  distR = (1.0-r6)*distR + r6*(lineY- m*lineX - bb)*dbInv;
  float notr0123456 = 1.0 - rSm;
  bb -= db;
  float r7 = notr0123456 * float(lineY > m*lineX + bb);
  rSm += r7;
  distR = (1.0-r7)*distR + r7*(lineY- m*lineX - bb)*dbInv;
  float notr01234567 = 1.0 - rSm;
  float r8 = notr01234567;
  vec3 currColor = r0*F + r1*E + r2*D + r3*C + r4*B + r5*A + r6*F + r7*E + r8*D;
  vec3 downColor = r0*E + r1*D + r2*C + r3*B + r4*A + r5*F + r6*E + r7*D + r8*C;
  float blendR = distR / distRLimit;
  float blendROpp = 1.0 - blendR;
  float mixed = float(distR > 0.0)*float(distR < distRLimit);
  vec3 color = currColor * (1.0 - mixed) + mixed * (downColor*blendROpp + currColor*blendR);
  gl_FragColor.r = bounce_magnitude + color.x*rgb;
  gl_FragColor.g = bounce_magnitude + color.y*rgb;
  gl_FragColor.b = bounce_magnitude + color.z*rgb;
  
}
`;

other_funcs = `
vec4 vector_plane_intersect(vec3 vp, vec3 vd, vec3 pp, vec3 pn){
  float vectorDotNormal = dot(vd, pn);
  float d = dot(pp - vp, pn) / vectorDotNormal;
  return vec4(vp + d * vd, d);
}

int get_current_side(vec3 p){
  float mx = abs(p.x);
  float my = abs(p.y);
  float mz = abs(p.z);
  int x_cross = int((mx*SQ.y*SQ.z > my*SQ.x*SQ.z) && (mx*SQ.y*SQ.z > mz*SQ.x*SQ.y));
  int y_cross = int(my*SQ.x*SQ.z > mz*SQ.x*SQ.y);
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
  int skip = get_current_side(p);
  vec4 rtn = vec4(1.0, 0.0, 1.0, 8.0*ENV_D);
  vec3 side;
  side.x = 1.0 - 2.0*float(skip == 0);
  side.y = 0.0;
  side.z = 0.0;
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.x = -float(skip > 1);
  side.y = float(skip < 2);
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
`;