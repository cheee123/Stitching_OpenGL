#include"Texture.h"

Texture::Texture(const char* image, const char* texType, GLuint slot)
{
	// Assigns the type of the texture ot the texture object
	type = texType;

	// Stores the width, height, and the number of color channels of the image
	cv::Mat inimg = cv::imread(image);
	// cv::flip(inimg, inimg, 0);
	cv::cvtColor(inimg, inimg, cv::COLOR_RGB2BGR);
	unsigned char* bytes = inimg.data;
	if(!bytes){
		printf("Can not read image for Texture%d", unit);
	}
	widthImg  = inimg.cols;
	heightImg = inimg.rows;

	// Generates an OpenGL texture object
	glGenTextures(1, &ID);
	// Assigns the texture to a Texture Unit
	glActiveTexture(GL_TEXTURE0 + slot);
	unit = slot;
	glBindTexture(GL_TEXTURE_2D, ID);

	glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
	// Configures the type of algorithm that is used to make the image smaller or bigger
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	// Configures the way the texture repeats (if it does at all)
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	// Extra lines in case you choose to use GL_CLAMP_TO_BORDER
	// float flatColor[] = {1.0f, 1.0f, 1.0f, 1.0f};
	// glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, flatColor);


	// Check what type of color channels the texture has and load it accordingly
	glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,widthImg,heightImg,0,GL_RGB,GL_UNSIGNED_BYTE,bytes);


	// Generates MipMaps
	glGenerateMipmap(GL_TEXTURE_2D);

	// Deletes the image data as it is already in the OpenGL Texture object
	//stbi_image_free(bytes);
	
	// Unbinds the OpenGL Texture object so that it can't accidentally be modified
	glBindTexture(GL_TEXTURE_2D, 0);
}
void Texture::NewImage(unsigned char* bytes){
	glActiveTexture(GL_TEXTURE0 + unit);
	glBindTexture(GL_TEXTURE_2D, ID);
	glTexSubImage2D(GL_TEXTURE_2D,0,0,0,widthImg,heightImg,GL_RGB,GL_UNSIGNED_BYTE,bytes);
	// glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,widthImg,heightImg,0,GL_RGB,GL_UNSIGNED_BYTE,bytes);
	glBindTexture(GL_TEXTURE_2D, 0);
}
void Texture::texUnit(Shader& shader, const char* uniform)
{
	// Gets the location of the uniform
	GLuint texUni = glGetUniformLocation(shader.ID, uniform);
	// Shader needs to be activated before changing the value of a uniform
	shader.Activate();
	// Sets the value of the uniform
	glUniform1i(texUni, unit);
}

void Texture::Bind()
{
	glActiveTexture(GL_TEXTURE0 + unit);
	glBindTexture(GL_TEXTURE_2D, ID);
}

void Texture::Unbind()
{
	glBindTexture(GL_TEXTURE_2D, 0);
}

void Texture::Delete()
{
	glDeleteTextures(1, &ID);
}