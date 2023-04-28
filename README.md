# Image Stitching with OpenGL(ES)

This project is aimed to build a GLES application that can stitch 6 images together (on Linux system). The stitching method is Cylindrical Projection + Homography Transform, and the blending method is Weighted Blending.

For detailed information, please refer to:

https://www.scribd.com/document/510892625/Panorama-Stitching-P2#
https://www.youtube.com/watch?v=D9rAOAL12SY

## 1) Python

Basically, we have to guess the value of focal length in Cylindrical Projection, calculate all Homography matrix, and create a Weight Map image before moving to OpenGL.

The main idea is to find Homography matrix of every images to the center image, then warp every image into the center image's perspective.

The provided Python code can easily implement this part, you can open it with Colab, upload the 6 images, and run each block to see the result.

With the auto-generated code, you can copy and paste it in to OpenGL. (main.cpp , line 93)

## 2) OpenGL

Cylindrical Projection, Homography Transformation and Weighted Bleding are all implemented by GLSL. (stitching.frag)

The required libraries for this project: opencv, GLES, glfw, glm

For opencv installation, please refer to this website:

https://docs.opencv.org/4.x/d7/d9f/tutorial_linux_install.html

For GLES installation, please use this command:

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
