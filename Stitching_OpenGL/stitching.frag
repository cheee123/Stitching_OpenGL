#version 310 es
precision highp float;
precision highp sampler2D;

// Outputs colors
out vec4 FragColor;

// Inputs the texture coordinates from the Vertex Shader
in vec2 texCoord;

// Gets the Texture Unit from the main function
uniform highp sampler2D tex0;
uniform highp sampler2D tex1;
uniform highp sampler2D tex2;
uniform highp sampler2D tex3;
uniform highp sampler2D tex4;
uniform highp sampler2D tex5;
uniform highp sampler2D WM;

// Homography matrices
uniform highp mat3 H_T30;
uniform highp mat3 H_T31;
uniform highp mat3 H_T32;
uniform highp mat3 H_T34;
uniform highp mat3 H_T35;

// Uniforms
uniform highp float f;
uniform highp float border_ratio;

const float center_y = 0.5;
const float center_x = 0.5;

vec2 translate_cylin(vec2 cylinCoord){
	// Filter
	if(cylinCoord.x<0.0 || cylinCoord.x>1.0){
		return cylinCoord;
	}

	// Translate to ROI
	float cylin_y = cylinCoord.y;
	float cylin_x = (cylinCoord.x * (1.0 - 2.0*border_ratio)) + border_ratio;

	// Here tan, cos is in radians
	float xt = (f * tan((cylin_x - center_x)) / f) + center_x;
	float yt = ((cylin_y - center_y) / cos(((cylin_x - center_x) / f))) + center_y;
	return vec2(xt,yt);
}

// Homography transform -> Cylindrical projection
vec2 translate30(vec2 texCoord){
	vec3 img_right_coor = H_T30 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate31(vec2 texCoord){
	vec3 img_right_coor = H_T31 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate32(vec2 texCoord){
	vec3 img_right_coor = H_T32 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate33(vec2 texCoord){
	return translate_cylin(texCoord);
}
vec2 translate34(vec2 texCoord){
	vec3 img_right_coor = H_T34 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate35(vec2 texCoord){
	vec3 img_right_coor = H_T35 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}

void main()
{
	const float N = 6.0;      // number of images
	const float N_half = 3.0; // int(images / 2)

	vec2 texCoord_b = vec2(texCoord.x * N - N_half, texCoord.y); // start position of center image
	// now texCoord_b.x is from -3.0 to 3.0

	// Find the correct pixel in each images
	vec2 texCoord0 = translate30(texCoord_b);
	vec2 texCoord1 = translate31(texCoord_b);
	vec2 texCoord2 = translate32(texCoord_b);
	vec2 texCoord3 = translate33(texCoord_b);
	vec2 texCoord4 = translate34(texCoord_b);
	vec2 texCoord5 = translate35(texCoord_b);
	
	// Get values from Weight Map
	float WM0 = texture(WM,texCoord0).x;
	float WM1 = texture(WM,texCoord1).x;
	float WM2 = texture(WM,texCoord2).x;
	float WM3 = texture(WM,texCoord3).x;
	float WM4 = texture(WM,texCoord4).x;
	float WM5 = texture(WM,texCoord5).x;

	// Pixel value multiply with its Weights
	vec4 color0 = texture(tex0, texCoord0) * WM0;
	vec4 color1 = texture(tex1, texCoord1) * WM1;
	vec4 color2 = texture(tex2, texCoord2) * WM2;
	vec4 color3 = texture(tex3, texCoord3) * WM3;
	vec4 color4 = texture(tex4, texCoord4) * WM4;
	vec4 color5 = texture(tex5, texCoord5) * WM5;

	// Final color
	FragColor = (color0 + color1 + color2 + color3 + color4 + color5) / (WM0+WM1+WM2+WM3+WM4+WM5);
}