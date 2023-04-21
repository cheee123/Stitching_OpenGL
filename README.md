# Multiple images stitching using OpenGL(ES)

This project is aimed to build a GLES application that can stitch 6 images together

Separated into two parts: Python and OpenGL

For detailed theory, please refer to:

https://www.scribd.com/document/510892625/Panorama-Stitching-P2#

## 1) Python

Basically, we have to calculate all Homography before moving into OpenGL.

The main idea is to find Homography matrix of every images to the center image, then warp everything into the center image's perspective.

The provided Python code can easily implement this part, we can open it in Colab, upload the 6 images, and run each block to see the result.

After getting the auto-generated code, we can copy and paste it in to OpenGL (main.cpp , line 117)

## 2) OpenGL

Cylindrical Projection and Homography Transfomation are executed inside GLSL at the same time (stitching.frag).

Required libraries for this part: opencv, GLES, glfw, glm

For opencv installation, please refer to this website:

https://docs.opencv.org/4.x/d7/d9f/tutorial_linux_install.html

For GLES installation:

```
sudo apt-get install libglfw3-dev libgles2-mesa-dev
```

For glfw and glm, please install using these commands (must cd to main dir first):

```
cd Stitching_OpenGL/Stitching_OpenGL
git submodule add https://github.com/glfw/glfw.git external/glfw
git submodule add https://github.com/g-truc/glm.git external/glm
```

After all the packages and libraries are installed, please change the mode of the following files by doing:

```
chmod +x ./doall.sh ./buildrun.sh ./run.sh
```

Then run this command to do all the jobs (cmake, make, etc.)
```
./doall.sh
```
