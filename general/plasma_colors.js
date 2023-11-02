set_color_func_text_lightning = `
mat2 r2d (in float degree)
{
	float rad = radians (degree);
	float c = cos (rad);
	float s = sin (rad);
	return mat2 (vec2 (c, s),vec2 (-s, c));
}

vec2 hash (in vec2 p)
{
	p = vec2 (dot (p, vec2 (127.1, 311.7)),
			  dot (p, vec2 (269.5, 183.3)));

	return -1. + 2.*fract (sin (p)*43758.5453123);
}

float noise (in vec2 p)
{
    const float K1 = .366025404;
    const float K2 = .211324865;

	vec2 i = floor (p + (p.x + p.y)*K1);
	
    vec2 a = p - i + (i.x + i.y)*K2;
    vec2 o = step (a.yx, a.xy);    
    vec2 b = a - o + K2;
	vec2 c = a - 1. + 2.*K2;

    vec3 h = max (.5 - vec3 (dot (a, a), dot (b, b), dot (c, c) ), .0);

	vec3 n = h*h*h*h*vec3 (dot (a, hash (i + .0)),
						   dot (b, hash (i + o)),
						   dot (c, hash (i + 1.)));

    return dot (n, vec3 (70.));
}

float fbm (in vec2 p)
{
	mat2 rot = r2d (27.5);
    float d = noise (p); p *= rot;
    d += .5*noise (p); p *= rot;
    d += .25*noise (p); p *= rot;
    d += .125*noise (p); p *= rot;
    d += .0625*noise (p);
	d /= (1. + .5 + .25 + .125 + .0625);
	return .5 + .5*d;
}

vec2 cart2polar (in vec2 cart)
{
    float r = length (cart);
    float phi = atan (cart.y, cart.x);
    return vec2 (r, phi); 
}

vec2 polar2cart (in vec2 polar)
{
    float x = polar.x*cos (polar.y);
    float y = polar.x*sin (polar.y);
    return vec2 (x, y); 
}

float _getLightning(float sz, float iTime) {
  vec2 uv = 1. + 1.*v_pos_orig.xy;
	uv *= r2d (12.*iTime);
    float len = length (uv);
	float thickness = .25;
    float haze = 2.5;

    // distort UVs a bit
    uv = cart2polar (uv);
    uv.y += .2*(.5 + .5*sin(cos (uv.x)*len));
    uv = polar2cart (uv);

    float d1 = abs ((uv.x*haze)*thickness / (uv.x + fbm (uv + 1.25*iTime)));
    float d2 = abs ((uv.y*haze)*thickness / (uv.y + fbm (uv - 1.5*iTime)));
    float d3 = abs ((uv.x*uv.y*haze)*thickness / (uv.x*uv.y + fbm (uv - 2.*iTime)));
    float val = (d1+d2+d3) * sz;
    float threshold = 0.4;
    return float(val >= threshold) * val;
}

float getLightning(float sz) {
    float l1 = _getLightning(sz, 0.4*u_data[0].y);
    float l2 = _getLightning(sz, 0.4*u_data[0].y + 4.0);
    return max(l1, l2);
}

float getLava(float sub) {
	vec2 uv = 0.5 + 0.5*v_pos_orig.xy;
    vec2 a = 5.0 * uv; 
    a.y -= 1.5*u_data[0].y;
	vec2 f = fract(a); 
    a -= f; 
    f = f*f*(3.0-2.0*f);
    vec4 r = fract(sin(vec4(a.x + a.y*1000.0) + vec4(0., 1., 1000., 1001.)) * 1e5)*30./uv.y;
	return clamp(mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y)-sub, 0., 10.)*0.1;
}

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
  vec4 clr = vec4((1.0-solid)*glassy + solid*solidColor, 1.0);
  float l1_val = getLightning(0.035);
  float l2_val = getLightning(0.055);
  float hasl1 = float(l1_val > 0.0);
  float hasl2 = float(l2_val > 0.0);
  float lava1_val = getLava(27.0);
  float lava2_val = getLava(27.0);
  float hasLava1 = float(lava1_val > 0.5);
  float hasLava2 = float(lava2_val > 0.5);
  float lg1 = u_data[0].z*hasl1 + (1.0-u_data[0].z)*hasLava1;
  float lg2 = (1.0-lg1) * (u_data[0].z*hasl2 + (1.0-u_data[0].z)*hasLava2);
  float lg = lg1 + lg2;
  vec4 lgClr = vec4(vec3(0.2, 1.0, 0.4)*(0.7+0.3*r)*(0.5+0.5*(1.-bounce_magnitude)), 1.0);
  float lVal = min(1.0, 0.8*l2_val);
  vec4 lightningColor = lVal * vec4(1.0) + (1.0-lVal) * lgClr;
  float lavaVal = min(1.0, 1.15 * (sqrt(lava2_val-0.5)));
  vec4 lavaColor = lavaVal*vec4(1.0) + (1.0 - lavaVal) * lgClr;
  gl_FragColor = (1.0-lg)*clr + lg*(u_data[0].z*lightningColor + (1.0-u_data[0].z)*lavaColor);
}
`;
