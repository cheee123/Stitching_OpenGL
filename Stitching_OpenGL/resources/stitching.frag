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

// Homography matrices
uniform highp mat3 H_T30;
uniform highp mat3 H_T31;
uniform highp mat3 H_T32;
uniform highp mat3 H_T34;
uniform highp mat3 H_T35;

// Uniforms
uniform highp float f;
uniform highp float border_ratio;

vec2 translate_cylin(vec2 cylinCoord){
	const float center_y = 0.5;
	const float center_x = 0.5;
	const float  M_PI = 3.14159265358;
	
	// Filter
	if(cylinCoord.x<0.0 || cylinCoord.x>1.0){
		return cylinCoord;
	}

	// translate to roi
	float cylin_y = cylinCoord.y;
	float cylin_x = (cylinCoord.x * (1.0 - 2.0*border_ratio)) + border_ratio;

	// here tan is in radians, but our's is degree
	float xt = (f * tan((cylin_x - center_x)) / f) + center_x;
	float yt = ((cylin_y - center_y) / cos(((cylin_x - center_x) / f))) + center_y;
	return vec2(xt,yt);
}


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
	const float N = 6.0; // number of images
	const float N_half = 3.0; // number of int(images / 2)
	vec2 texCoord_b = vec2(texCoord.x * N - N_half, texCoord.y); // start position of center image
	vec2 texCoord0 = translate30(texCoord_b);
	vec2 texCoord1 = translate31(texCoord_b);
	vec2 texCoord2 = translate32(texCoord_b);
	vec2 texCoord3 = translate33(texCoord_b);
	vec2 texCoord4 = translate34(texCoord_b);
	vec2 texCoord5 = translate35(texCoord_b);

	if(texCoord0.x > 0.0 && texCoord0.x < 1.0 && texCoord0.y > 0.0 && texCoord0.y < 1.0)
		FragColor = texture(tex0, vec2(texCoord0.x,texCoord0.y));
	else if(texCoord1.x > 0.0 && texCoord1.x < 1.0 && texCoord1.y > 0.0 && texCoord1.y < 1.0)
		FragColor = texture(tex1, vec2(texCoord1.x,texCoord1.y));
	else if(texCoord2.x > 0.0 && texCoord2.x < 1.0 && texCoord2.y > 0.0 && texCoord2.y < 1.0)
		FragColor = texture(tex2, vec2(texCoord2.x,texCoord2.y));
	else if(texCoord3.x > 0.0 && texCoord3.x < 1.0 && texCoord3.y > 0.0 && texCoord3.y < 1.0)
		FragColor = texture(tex3, vec2(texCoord3.x,texCoord3.y));
	else if(texCoord4.x > 0.0 && texCoord4.x < 1.0 && texCoord4.y > 0.0 && texCoord4.y < 1.0)
		FragColor = texture(tex4, vec2(texCoord4.x,texCoord4.y));
	else
		FragColor = texture(tex5, texCoord5);
	//FragColor = texture(tex0, texCoord);
	//FragColor = vec4(0.5,0.0,0.0,1.0);
}