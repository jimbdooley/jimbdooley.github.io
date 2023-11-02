roundShaderParams = {
  block_entry:1,
  r1:0.5,
  r2:0.77,
  r3:1,
  tri0_z:0.9,
  tri2_z:0.77,
}

function updateRoundVars(){
  tri_0_not_z = Math.sqrt(1 - roundShaderParams.tri0_z*roundShaderParams.tri0_z);
  tri0_x = tri_0_not_z*Math.cos(Math.PI/8);
  tri0_y = tri_0_not_z*Math.sin(Math.PI/8);
  tri1_x = tri_0_not_z*Math.cos(3*Math.PI/8);
  tri1_y = tri_0_not_z*Math.sin(3*Math.PI/8);
  tri_2_not_z = Math.sqrt(1 - roundShaderParams.tri2_z * roundShaderParams.tri2_z);
  center_line0_m = (roundShaderParams.r1*(1 - Math.sin(Math.PI/4))) / (-roundShaderParams.r1*Math.cos(Math.PI/4))
  center_line0_b = roundShaderParams.r1;
  center_line1_m = (roundShaderParams.r1*Math.sin(Math.PI/4)) / (roundShaderParams.r1*(Math.cos(Math.PI/4)-1))
  center_line1_b = -center_line1_m*roundShaderParams.r1;
  tri0_line0_m = (roundShaderParams.r1*Math.sin(Math.PI/4) - roundShaderParams.r2*Math.sin(Math.PI/8)) / (roundShaderParams.r1*Math.cos(Math.PI/4) - roundShaderParams.r2*Math.cos(Math.PI/8));
  tri0_line0_b = roundShaderParams.r1*Math.sin(Math.PI/4) - roundShaderParams.r1*Math.cos(Math.PI/4)*tri0_line0_m;
  tri0_line1_m = (roundShaderParams.r1*Math.sin(0) - roundShaderParams.r2*Math.sin(Math.PI/8)) / (roundShaderParams.r1*Math.cos(0) - roundShaderParams.r2*Math.cos(Math.PI/8));
  tri0_line1_b = roundShaderParams.r1*Math.sin(0) - roundShaderParams.r1*Math.cos(0)*tri0_line1_m;
  tri1_line0_m = (roundShaderParams.r1*Math.sin(Math.PI/2) - roundShaderParams.r2*Math.sin(3*Math.PI/8)) / (roundShaderParams.r1*Math.cos(Math.PI/2) - roundShaderParams.r2*Math.cos(3*Math.PI/8));
  tri1_line0_b = roundShaderParams.r1*Math.sin(Math.PI/2) - roundShaderParams.r1*Math.cos(Math.PI/2)*tri1_line0_m;
  tri1_line1_m = (roundShaderParams.r1*Math.sin(Math.PI/4) - roundShaderParams.r2*Math.sin(3*Math.PI/8)) / (roundShaderParams.r1*Math.cos(Math.PI/4) - roundShaderParams.r2*Math.cos(3*Math.PI/8));
  tri1_line1_b = roundShaderParams.r1*Math.sin(Math.PI/4) - roundShaderParams.r1*Math.cos(Math.PI/4)*tri1_line1_m;
  tri2_line0_m = (roundShaderParams.r3 - roundShaderParams.r2*Math.sin(3*Math.PI/8)) / (-roundShaderParams.r2*Math.cos(3*Math.PI/8));
  tri2_line0_b = roundShaderParams.r3;
  tri2_x_lim = roundShaderParams.r2*Math.cos(3*Math.PI/8);
  tri3_line0_m = (roundShaderParams.r2*Math.sin(Math.PI/8)) / (roundShaderParams.r2*Math.cos(Math.PI/8) - roundShaderParams.r3);
  tri3_line0_b = -tri3_line0_m*roundShaderParams.r3;
  tri3_y_lim = tri2_x_lim;
  tri4_line0_m = (roundShaderParams.r2*Math.sin(3*Math.PI/8) - roundShaderParams.r3*Math.sin(Math.PI/4)) / (roundShaderParams.r2*Math.cos(3*Math.PI/8) - roundShaderParams.r3*Math.cos(Math.PI/4));
  tri4_line0_b = roundShaderParams.r3*Math.sin(Math.PI/4) - tri4_line0_m*roundShaderParams.r3*Math.cos(Math.PI/4);
  tri4_line1_m = (roundShaderParams.r2*Math.sin(Math.PI/8) - roundShaderParams.r3*Math.sin(Math.PI/4)) / (roundShaderParams.r2*Math.cos(Math.PI/8) - roundShaderParams.r3*Math.cos(Math.PI/4));
  tri4_line1_b = roundShaderParams.r3*Math.sin(Math.PI/4) - tri4_line1_m*roundShaderParams.r3*Math.cos(Math.PI/4);
  tri4_line1_m_inv = 1 / tri4_line1_m;
  tri4_line1_b_inv = - tri4_line1_b/tri4_line1_m;

}
updateRoundVars();

cubeShape = {x:0, y:0, z:0}
for(let i = 0; i < round.posArr.length; i+=4){
  cubeShape.x = Math.max(cubeShape.x, Math.abs(round.posArr[i]));
  cubeShape.y = Math.max(cubeShape.y, Math.abs(round.posArr[i+1]));
  cubeShape.z = Math.max(cubeShape.z, Math.abs(round.posArr[i+2]));
}
cubeShape.x *= 1.01;
cubeShape.y *= 1.01;
cubeShape.z *= 1.01;

function update_round_get_normal_func(){
  round_get_normal_func = `

  \n#define cubeShape vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define SQ vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define BLOCK_ENTRY ${q(Math.floor(roundShaderParams.block_entry))}
  \n

  vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = abs(dir.y);
    float z = abs(dir.z);

    float center = float(y < x*${q(center_line0_m)} + ${q(center_line0_b)}) * float(y < x*${q(center_line1_m)} + ${q(center_line1_b)});
    float tri0 = float(y < x*${q(tri0_line0_m)} + ${q(tri0_line0_b)}) * float(y > x*${q(tri0_line1_m)} + ${q(tri0_line1_b)});
    float tri1 = float(y < x*${q(tri1_line0_m)} + ${q(tri1_line0_b)}) * float(y < x*${q(tri1_line1_m)} + ${q(tri1_line1_b)});
    float not_in_center_tri0_tri1 =  (1.0-tri0)*(1.0-tri1);
    float tri2 = not_in_center_tri0_tri1*float(y < x*${q(tri2_line0_m)} + ${q(tri2_line0_b)}) * float(x <= ${q(tri2_x_lim)});
    float tri3 = not_in_center_tri0_tri1*float(y < x*${q(tri3_line0_m)} + ${q(tri3_line0_b)}) * float(y <= ${q(tri3_y_lim)});
    float not_in_tri2_tri3 = (1.0-tri2)*(1.0-tri3);
    float tri4 = not_in_tri2_tri3*not_in_center_tri0_tri1*float(y < x*${q(tri4_line0_m)} + ${q(tri4_line0_b)}) * float(x < y*${q(tri4_line1_m_inv)} + ${q(tri4_line1_b_inv)});



    vec3 rtn = center * vec3(0.0, 0.0, 1.0);
    rtn = rtn + (1.0-center) * (tri0*vec3(${q(tri0_x)}, ${q(tri0_y)}, ${q(roundShaderParams.tri0_z)}) + tri1*vec3(${q(tri1_x)}, ${q(tri1_y)}, ${q(roundShaderParams.tri0_z)}));
    rtn = rtn + tri2*vec3(0.0, ${q(tri_2_not_z)}, ${q(roundShaderParams.tri2_z)});
    rtn = rtn + tri3*vec3(${q(tri_2_not_z)}, 0.0, ${q(roundShaderParams.tri2_z)});
    rtn = rtn + tri4*vec3(0.7071*${q(tri_2_not_z)}, 0.7071*${q(tri_2_not_z)}, ${q(roundShaderParams.tri2_z)});

    float x_max = float(x > y);
    float y_max = 1.0-x_max;

    vec3 edge_rtn = x_max*vec3(${Math.cos(Math.PI/8)}, ${Math.sin(Math.PI/8)}, 0.0) + y_max*vec3(${Math.sin(Math.PI/8)}, ${Math.cos(Math.PI/8)}, 0.0);
    return (rtn + (1.0-tri4)*not_in_tri2_tri3*not_in_center_tri0_tri1*edge_rtn) * vec3(x/dir.x, y/dir.y, z/dir.z);

  }\n\n`;

}
update_round_get_normal_func()
