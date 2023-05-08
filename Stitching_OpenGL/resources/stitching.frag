#version 320 es
precision highp float;
precision highp sampler2D;
precision highp samplerBuffer;

// Outputs colors
out vec4 FragColor;

// Inputs the texture coordinates from the Vertex Shader
in vec2 texCoord;

uniform highp samplerBuffer buf;

// Gets the Texture Unit from the main function
uniform highp sampler2D tex0;
uniform highp sampler2D tex1;
uniform highp sampler2D tex2;
uniform highp sampler2D tex3;
uniform highp sampler2D tex4;
uniform highp sampler2D tex5;
uniform highp sampler2D WM;

// Homography matrices
/*uniform highp mat3 H_T01;
uniform highp mat3 H_T02;
uniform highp mat3 H_T03;
uniform highp mat3 H_T04;
uniform highp mat3 H_T05;*/

// Uniforms
uniform highp float f;
uniform highp float border_ratio;
uniform highp float undrift;

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
	//float yt = f * tan((cylin_y - center_y)/f) / cos(((cylin_x - center_x) / f)) + center_y; //spherical
	return vec2(xt,yt);
}

// Homography transform -> Cylindrical projection
vec2 translate00(vec2 texCoord){
	return translate_cylin(texCoord);
}
vec2 translate01(vec2 texCoord, mat3 H_T01){
	vec3 img_right_coor = H_T01 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate02(vec2 texCoord, mat3 H_T02){
	vec3 img_right_coor = H_T02 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate03(vec2 texCoord, mat3 H_T03){
	vec3 img_right_coor = H_T03 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate04(vec2 texCoord, mat3 H_T04){
	vec3 img_right_coor = H_T04 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}
vec2 translate05(vec2 texCoord, mat3 H_T05){
	vec3 img_right_coor = H_T05 * vec3(texCoord.x, texCoord.y, 1.0);
	img_right_coor.x = img_right_coor.x / img_right_coor.z;
	img_right_coor.y = img_right_coor.y / img_right_coor.z;
	return translate_cylin(vec2(img_right_coor.x,img_right_coor.y));
}

void main()
{
	mat3 H_T01,H_T02,H_T03,H_T04,H_T05;
	H_T01[0][0] = texelFetch(buf,0).r;H_T01[0][1] = texelFetch(buf,1).r;H_T01[0][2] = texelFetch(buf,2).r;
	H_T01[1][0] = texelFetch(buf,3).r;H_T01[1][1] = texelFetch(buf,4).r;H_T01[1][2] = texelFetch(buf,5).r;
	H_T01[2][0] = texelFetch(buf,6).r;H_T01[2][1] = texelFetch(buf,7).r;H_T01[2][2] = texelFetch(buf,8).r;
	H_T02[0][0] = texelFetch(buf,9).r;H_T02[0][1] = texelFetch(buf,10).r;H_T02[0][2] = texelFetch(buf,11).r;
	H_T02[1][0] = texelFetch(buf,12).r;H_T02[1][1] = texelFetch(buf,13).r;H_T02[1][2] = texelFetch(buf,14).r;
	H_T02[2][0] = texelFetch(buf,15).r;H_T02[2][1] = texelFetch(buf,16).r;H_T02[2][2] = texelFetch(buf,17).r;
	H_T03[0][0] = texelFetch(buf,18).r;H_T03[0][1] = texelFetch(buf,19).r;H_T03[0][2] = texelFetch(buf,20).r;
	H_T03[1][0] = texelFetch(buf,21).r;H_T03[1][1] = texelFetch(buf,22).r;H_T03[1][2] = texelFetch(buf,23).r;
	H_T03[2][0] = texelFetch(buf,24).r;H_T03[2][1] = texelFetch(buf,25).r;H_T03[2][2] = texelFetch(buf,26).r;
	H_T04[0][0] = texelFetch(buf,27).r;H_T04[0][1] = texelFetch(buf,28).r;H_T04[0][2] = texelFetch(buf,29).r;
	H_T04[1][0] = texelFetch(buf,30).r;H_T04[1][1] = texelFetch(buf,31).r;H_T04[1][2] = texelFetch(buf,32).r;
	H_T04[2][0] = texelFetch(buf,33).r;H_T04[2][1] = texelFetch(buf,34).r;H_T04[2][2] = texelFetch(buf,35).r;
	H_T05[0][0] = texelFetch(buf,36).r;H_T05[0][1] = texelFetch(buf,37).r;H_T05[0][2] = texelFetch(buf,38).r;
	H_T05[1][0] = texelFetch(buf,39).r;H_T05[1][1] = texelFetch(buf,40).r;H_T05[1][2] = texelFetch(buf,41).r;
	H_T05[2][0] = texelFetch(buf,42).r;H_T05[2][1] = texelFetch(buf,43).r;H_T05[2][2] = texelFetch(buf,44).r;
	
	const float N = 6.0;      // number of images
	vec2 texCoord_b = vec2(texCoord.x * N, texCoord.y - undrift * texCoord.x * texCoord.x); // design x and y
	//vec2 texCoord_b = vec2(texCoord.x * N, texCoord.y); // design x and y

	// now texCoord_b.x is from 0.0 to 6.0
	// texCoord_b.y is decreasing as tex_Coord.x increases

	// Find the correct pixel in each images
	vec2 texCoord0 = translate00(texCoord_b);
	vec2 texCoord1 = translate01(texCoord_b, H_T01);
	vec2 texCoord2 = translate02(texCoord_b, H_T02);
	vec2 texCoord3 = translate03(texCoord_b, H_T03);
	vec2 texCoord4 = translate04(texCoord_b, H_T04);
	vec2 texCoord5 = translate05(texCoord_b, H_T05);
	
	// Get values from Weight Map
	float WM0 = texture(WM,texCoord0).x;
	float WM1 = texture(WM,texCoord1).x;
	float WM2 = texture(WM,texCoord2).x;
	float WM3 = texture(WM,texCoord3).x;
	float WM4 = texture(WM,texCoord4).x;
	float WM5 = texture(WM,texCoord5).x;

	// Pixel value multiply with its Weight
	vec3 color0 = texture(tex0, texCoord0).rgb * WM0;
	vec3 color1 = texture(tex1, texCoord1).rgb * WM1;
	vec3 color2 = texture(tex2, texCoord2).rgb * WM2;
	vec3 color3 = texture(tex3, texCoord3).rgb * WM3;
	vec3 color4 = texture(tex4, texCoord4).rgb * WM4;
	vec3 color5 = texture(tex5, texCoord5).rgb * WM5;

	// Final color
	FragColor = vec4((color0 + color1 + color2 + color3 + color4 + color5) / (WM0+WM1+WM2+WM3+WM4+WM5), 1.0);

}
