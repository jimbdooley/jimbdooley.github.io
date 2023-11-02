heartShaderParams = {
  "block_entry":1,
  "x0":0,"y0":0.32,
  "x1":0.28051539723391455,"y1":0.4744998381563767,
  "x2":0.5329792547444376,"y2":0.38586845193647734,
  "x3":0.4604969101162873,"y3":0.13784039516702265,
  "x4":0.25573888627722796,"y4":-0.14317952196563258,
  "x5":0,"y5":-0.2949543631580921,
  normz1:0.89,
  normth0:1.18*Math.PI/2,
  normth1:0.85*Math.PI/2,
  normth2:-0.1,
  normth3:-0.4,
  normth4:-0.5,
  yy0:0.52,
  yy1:0.55,
  xx2:0.62,yy2:0.27,
  yy3:-0.1,
  xx4:0.08,yy4:-0.43,
  normz2:0.75,
  normth20:0.95*Math.PI/2,
  normth21:0.2,
  normth22:-0.4,
  normth23:-0.6,
  normth24:-Math.PI/2,
  xxx2:0.75, yyy2:0.0,
  xxx3:0.56, yyy3:-0.5,
  bot:-0.73,
};

cubeShape = {x:0, y:0, z:0}
for(let i = 0; i < heart.posArr.length; i+=4){
  cubeShape.x = Math.max(cubeShape.x, Math.abs(heart.posArr[i]));
  cubeShape.y = Math.max(cubeShape.y, Math.abs(heart.posArr[i+1]));
  cubeShape.z = Math.max(cubeShape.z, Math.abs(heart.posArr[i+2]));
}
cubeShape.x *= 1.01;
cubeShape.y *= 1.01;
cubeShape.z *= 1.01;


function updateHeartVars(){
  const p = heartShaderParams;
  c_m0 = (p.y1-p.y0) / (p.x1-p.x0);
  c_b0 = p.y1 - p.x1 * c_m0;
  c_m1 = (p.y2-p.y1) / (p.x2-p.x1);
  c_b1 = p.y2 - p.x2 * c_m1;
  c_m2 = (p.y3-p.y2) / (p.x3-p.x2);
  c_b2 = p.y3 - p.x3 * c_m2;
  c_m3 = (p.y4-p.y3) / (p.x4-p.x3);
  c_b3 = p.y4 - p.x4 * c_m3;
  c_m4 = (p.y5-p.y4) / (p.x5-p.x4);
  c_b4 = p.y5 - p.x5 * c_m4;
  normx0=Math.sqrt(1-p.normz1*p.normz1)*Math.cos(p.normth0);
  normy0=Math.sqrt(1-p.normz1*p.normz1)*Math.sin(p.normth0);
  normx1=Math.sqrt(1-p.normz1*p.normz1)*Math.cos(p.normth1);
  normy1=Math.sqrt(1-p.normz1*p.normz1)*Math.sin(p.normth1);
  normx2=Math.sqrt(1-p.normz1*p.normz1)*Math.cos(p.normth2);
  normy2=Math.sqrt(1-p.normz1*p.normz1)*Math.sin(p.normth2);
  normx3=Math.sqrt(1-p.normz1*p.normz1)*Math.cos(p.normth3);
  normy3=Math.sqrt(1-p.normz1*p.normz1)*Math.sin(p.normth3);
  normx4=Math.sqrt(1-p.normz1*p.normz1)*Math.cos(p.normth4);
  normy4=Math.sqrt(1-p.normz1*p.normz1)*Math.sin(p.normth4);
  normx20=Math.sqrt(1-p.normz2*p.normz2)*Math.cos(p.normth20);
  normy20=Math.sqrt(1-p.normz2*p.normz2)*Math.sin(p.normth20);
  normx21=Math.sqrt(1-p.normz2*p.normz2)*Math.cos(p.normth21);
  normy21=Math.sqrt(1-p.normz2*p.normz2)*Math.sin(p.normth21);
  normx22=Math.sqrt(1-p.normz2*p.normz2)*Math.cos(p.normth22);
  normy22=Math.sqrt(1-p.normz2*p.normz2)*Math.sin(p.normth22);
  normx23=Math.sqrt(1-p.normz2*p.normz2)*Math.cos(p.normth23); 
  normy23=Math.sqrt(1-p.normz2*p.normz2)*Math.sin(p.normth23);
  normx24=Math.sqrt(1-p.normz2*p.normz2)*Math.cos(p.normth24);
  normy24=Math.sqrt(1-p.normz2*p.normz2)*Math.sin(p.normth24);
  s10_m = (p.y1 - p.yy0) / p.x1
  s10_b = p.yy0;
  s11_m = (p.yy1 - p.y1) / (p.x2 - p.x1);
  s11_b = p.y1 - p.x1*s11_m;
  s12_m_top = (p.yy2 - p.y2) / (p.xx2 - p.x2);
  s12_b_top = p.yy2 - s12_m_top * p.xx2;
  s12_m_bot = (p.yy2 - p.y3) / (p.xx2 - p.x3);
  s12_b_bot = p.yy2 - s12_m_bot * p.xx2;
  s13_m = (p.yy3 - p.y4) / (p.x3 - p.x4);
  s13_b = p.y4 - s13_m * p.x4;
  s14_m = (p.yy4 - p.y5) / (p.xx4);
  s14_b = p.y5;
  s14_m2 = (p.y4 - p.yy4) / (p.x4 - p.xx4);
  s14_b2 = p.y4 - s14_m2 * p.x4;
  s22_m = (p.yy2 - p.yyy2) / (p.xx2-p.xxx2);
  s22_b = p.yyy2 - s22_m*p.xxx2;
  s22_m2 = (p.yy3 - p.yyy2) / (p.x3-p.xxx2);
  s22_b2 = p.yyy2 - s22_m2*p.xxx2;
  s23_m = (p.yy3 - p.yyy3) / (p.x3-p.xxx3);
  s23_b = p.yyy3 - s23_m*p.xxx3;
  s23_m2 = (p.yy4 - p.yyy3) / (p.xx4-p.xxx3);
  s23_b2 = p.yyy3 - s23_m2*p.xxx3;
  s24_m = (p.yy4 - p.bot) / (p.xx4);
  s24_b = p.bot;
}
updateHeartVars();


function _update_heart_get_normal_func(){
  heart_get_normal_func = `

  \n#define cubeShape vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define SQ vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define BLOCK_ENTRY ${q(Math.floor(heartShaderParams.block_entry))}
  \n

  vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = dir.y;
    float z = abs(dir.z);
    float z_max = float(z*SQ.x*SQ.y > x*SQ.y*SQ.z) * float(z*SQ.x*SQ.y > abs(y)*SQ.x*SQ.z);
    float x_max = (1.0 - z_max) * float(x*SQ.y*SQ.z > abs(y)*SQ.x*SQ.z);
    float y_max = (1.0 - x_max) * (1.0 - z_max);
    float z_max_x_max = float(x*SQ.y > abs(y)*SQ.x);
    float z_max_y_max = 1.0 - z_max_x_max;
    float x_sign = dir.x/x;
    float y_sign = dir.y/abs(y);
    float z_sign = dir.z/z;

    float center = float(y<x*${q(c_m0)}+${(c_b0)})*float(y<x*${q(c_m1)}+${(c_b1)})*float(y>x*${q(c_m2)}+${(c_b2)})*float(y>x*${q(c_m3)}+${(c_b3)})*float(y>x*${q(c_m4)}+${(c_b4)});
    float seg10 = float(y < x*${q(s10_m)} + ${q(s10_b)}) * float(x < ${q(heartShaderParams.x1)}) * float(y > 0.0);
    float seg11 = float(y > ${q(heartShaderParams.y2)}) * float(y < x*${q(s11_m)} + ${q(s11_b)}) * float(x > ${q(heartShaderParams.x1)}) * float(x < ${q(heartShaderParams.x2)});
    float seg12 = float(y < x + ${q(heartShaderParams.y2)} - ${q(heartShaderParams.x2)}) * float(y < x*${q(s12_m_top)} + ${q(s12_b_top)}) * float(y > x*${q(s12_m_bot)} + ${q(s12_b_bot)});
    float seg13 = float(y > x*${q(s13_m)} + ${q(s13_b)}) * float(x < ${q(heartShaderParams.x3)}) * float(y < ${q(heartShaderParams.y3)});
    float seg14 = float(y > max(${q(s14_m2)}*x + ${q(s14_b2)}, ${q(s14_m)}*x + ${q(s14_b)})) * float(y < 0.0);

    float seg1x = (1.0 - center) * (seg10 + seg11 + seg12 + seg13 + seg14);
    vec3 seg1_norm = seg10 * vec3(${q(normx0)}, ${q(normy0)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg11 * vec3(${q(normx1)}, ${q(normy1)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg12 * vec3(${q(normx2)}, ${q(normy2)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg13 * vec3(${q(normx3)}, ${q(normy3)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg14 * vec3(${q(normx4)}, ${q(normy4)}, ${q(heartShaderParams.normz1)});

    float seg20 = float(y > ${q(heartShaderParams.y0)}) * float(y < min(-0.7*x + 0.7*${q(heartShaderParams.x2)} + ${q(heartShaderParams.yy1)}, 0.7*x + ${q(heartShaderParams.yy0)})) * float(x < ${q(heartShaderParams.x2)});
    float seg21 = float(x > ${q(heartShaderParams.x2)}) * float(y > ${q(heartShaderParams.yy2)}) * float(y > 1.3*x + ${q(heartShaderParams.yy2 - 1.3*heartShaderParams.xx2)}) * float(y < ${q(heartShaderParams.yy1)});
    float seg22 = float(y > ${q(heartShaderParams.yy3)}) * float(y < ${q(heartShaderParams.yy2)}) * float(y < ${q(s22_m)}*x + ${q(s22_b)}) * float(y > ${q(s22_m2)}*x + ${q(s22_b2)});
    float seg23 = float(x > ${q(heartShaderParams.xx4)}) * float(y < ${q(heartShaderParams.yy3)}) * float(y < ${q(s23_m)}*x + ${q(s23_b)}) * float(y > ${q(s23_m2)}*x + ${q(s23_b2)});
    float seg24 = float(y < 0.0) * float(y > x*${q(s24_m)} + ${q(s24_b)});

    vec3 seg20_norm = vec3(${q(normx20)}, ${q(normy20)}, ${q(heartShaderParams.normz2)});
    vec3 seg21_norm = vec3(${q(normx21)}, ${q(normy21)}, ${q(heartShaderParams.normz2)});
    vec3 seg22_norm = vec3(${q(normx22)}, ${q(normy22)}, ${q(heartShaderParams.normz2)});
    vec3 seg23_norm = vec3(${q(normx23)}, ${q(normy23)}, ${q(heartShaderParams.normz2)});
    vec3 seg24_norm = vec3(${q(normx24)}, ${q(normy24)}, ${q(heartShaderParams.normz2)});

    float seg2x = (1.0 - center) * (1.0 - seg1x) * (seg20 + seg21 + seg22 + seg23 + seg24);
    vec3 seg2_norm = seg20 * seg20_norm + seg21 * seg21_norm + seg22 * seg22_norm + seg23 * seg23_norm + seg24 * seg24_norm;

    float edge = z_max * (1.0 - center) * (1.0 - seg1x) * (1.0 - seg2x);
    vec3 edge_norm = vec3(0.866*z_max_x_max, 0.866*z_max_y_max * y_sign, 0.5);
    
    vec3 rtn = edge*edge_norm + y_max*vec3(0.0, y_sign, 0.0) + x_max*vec3(1.0, 0.0, 0.0) + seg1x*seg1_norm + seg2x*seg2_norm + center * vec3(0.0, 0.0, 1.0);
    

    return rtn * vec3(x_sign, 1.0, z_sign);
    
  }\n\n`;

}


function update_heart_get_normal_func(){
  heart_get_normal_func = `

  \n#define cubeShape vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define SQ vec3(${q(cubeShape.x)}, ${q(cubeShape.y)}, ${q(cubeShape.z)})
  \n#define BLOCK_ENTRY ${q(Math.floor(heartShaderParams.block_entry))}
  \n

  vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = dir.y;
    float z = abs(dir.z);
    float z_max = float(z*SQ.x*SQ.y > x*SQ.y*SQ.z) * float(z*SQ.x*SQ.y > abs(y)*SQ.x*SQ.z);
    float x_max = (1.0 - z_max) * float(x*SQ.y*SQ.z > abs(y)*SQ.x*SQ.z);
    float y_max = (1.0 - x_max) * (1.0 - z_max);
    float z_max_x_max = float(x*SQ.y > abs(y)*SQ.x);
    float z_max_y_max = 1.0 - z_max_x_max;
    float x_sign = dir.x/x;
    float y_sign = dir.y/abs(y);
    float z_sign = dir.z/z;

    float center = float(y<x*${q(c_m0)}+${q(c_b0)})*float(y<x*${q(c_m1)}+${q(c_b1)})*float(y>x*${q(c_m2)}+${q(c_b2)})*float(y>x*${q(c_m3)}+${q(c_b3)})*float(y>x*${q(c_m4)}+${q(c_b4)});
    float seg10 = float(y < x*${q(s10_m)} + ${q(s10_b)}) * float(x < ${q(heartShaderParams.x1)}) * float(y > 0.0);
    float seg11 = float(y > ${q(heartShaderParams.y2)}) * float(y < x*${q(s11_m)} + ${q(s11_b)}) * float(x > ${q(heartShaderParams.x1)}) * float(x < ${q(heartShaderParams.x2)});
    float seg12 = float(y < x + ${q(heartShaderParams.y2)} - ${q(heartShaderParams.x2)}) * float(y < x*${q(s12_m_top)} + ${q(s12_b_top)}) * float(y > x*${q(s12_m_bot)} + ${q(s12_b_bot)});
    float seg13 = float(y > x*${q(s13_m)} + ${q(s13_b)}) * float(x < ${q(heartShaderParams.x3)}) * float(y < ${q(heartShaderParams.y3)});
    float seg14 = float(y > max(${q(s14_m2)}*x + ${q(s14_b2)}, ${q(s14_m)}*x + ${q(s14_b)})) * float(y < 0.0);

    float seg1x = (1.0 - center) * (seg10 + seg11 + seg12 + seg13 + seg14);
    vec3 seg1_norm = seg10 * vec3(${q(normx0)}, ${q(normy0)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg11 * vec3(${q(normx1)}, ${q(normy1)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg12 * vec3(${q(normx2)}, ${q(normy2)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg13 * vec3(${q(normx3)}, ${q(normy3)}, ${q(heartShaderParams.normz1)});
    seg1_norm = seg1_norm + seg14 * vec3(${q(normx4)}, ${q(normy4)}, ${q(heartShaderParams.normz1)});

    float seg20 = float(y > ${q(heartShaderParams.y0)}) * float(y < min(-0.7*x + 0.7*${q(heartShaderParams.x2)} + ${q(heartShaderParams.yy1)}, 0.7*x + ${q(heartShaderParams.yy0)})) * float(x < ${q(heartShaderParams.x2)});
    float seg21 = float(x > ${q(heartShaderParams.x2)}) * float(y > ${q(heartShaderParams.yy2)}) * float(y > 1.3*x + ${q(heartShaderParams.yy2 - 1.3*heartShaderParams.xx2)}) * float(y < ${q(heartShaderParams.yy1)});
    float seg22 = float(y > ${q(heartShaderParams.yy3)}) * float(y < ${q(heartShaderParams.yy2)}) * float(y < ${q(s22_m)}*x + ${q(s22_b)}) * float(y > ${q(s22_m2)}*x + ${q(s22_b2)});
    float seg23 = float(x > ${q(heartShaderParams.xx4)}) * float(y < ${q(heartShaderParams.yy3)}) * float(y < ${q(s23_m)}*x + ${q(s23_b)}) * float(y > ${q(s23_m2)}*x + ${q(s23_b2)});
    float seg24 = float(y < 0.0) * float(y > x*${q(s24_m)} + ${q(s24_b)});

    vec3 seg20_norm = vec3(${q(normx20)}, ${q(normy20)}, ${q(heartShaderParams.normz2)});
    vec3 seg21_norm = vec3(${q(normx21)}, ${q(normy21)}, ${q(heartShaderParams.normz2)});
    vec3 seg22_norm = vec3(${q(normx22)}, ${q(normy22)}, ${q(heartShaderParams.normz2)});
    vec3 seg23_norm = vec3(${q(normx23)}, ${q(normy23)}, ${q(heartShaderParams.normz2)});
    vec3 seg24_norm = vec3(${q(normx24)}, ${q(normy24)}, ${q(heartShaderParams.normz2)});

    float seg2x = (1.0 - center) * (1.0 - seg1x) * (seg20 + seg21 + seg22 + seg23 + seg24);
    vec3 seg2_norm = seg20 * seg20_norm + seg21 * seg21_norm + seg22 * seg22_norm + seg23 * seg23_norm + seg24 * seg24_norm;

    float edge = z_max * (1.0 - center) * (1.0 - seg1x) * (1.0 - seg2x);
    vec3 edge_norm = vec3(0.866*z_max_x_max, 0.866*z_max_y_max * y_sign, 0.5);
    
    float top = float(abs(dir.x) * 0.73 < dir.y) * 2.0 - 1.0;
    float right = 2.0*float(dir.x > 0.0) - 1.0;
    float cZ = 0.95;
    float cX = 0.3;
    float cNX = sqrt(1.0-cX*cX);
    vec3 rtn = edge*edge_norm + y_max*vec3(0.0, y_sign, 0.0) + x_max*vec3(1.0, 0.0, 0.0) + seg1x*seg1_norm + seg2x*seg2_norm + center * vec3(cX, cNX*top*sqrt(1.0-cZ*cZ), cNX*cZ);

    return rtn * vec3(x_sign, 1.0, z_sign);
    
  }\n\n`;

}
update_heart_get_normal_func()






