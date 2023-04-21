#ifndef TEXTURE_CLASS_H
#define TEXTURE_CLASS_H

#define STB_IMAGE_IMPLEMENTATION
#include <GLES3/gl31.h>
//#include <stb/stb_image.h>
#include "opencv2/imgcodecs.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/highgui.hpp"

#include"shaderClass.h"

class Texture
{
public:
	GLuint ID;
	const char* type;
	GLuint unit;
	int widthImg, heightImg;

	Texture(const char* image, const char* texType, GLuint slot);
	// Assigns a texture unit to a texture
	void texUnit(Shader& shader, const char* uniform);
	// Binds a texture
	void Bind();
	// Unbinds a texture
	void Unbind();
	// Deletes a texture
	void Delete();
	// Accept an image
	void NewImage(unsigned char* bytes);
};
#endif