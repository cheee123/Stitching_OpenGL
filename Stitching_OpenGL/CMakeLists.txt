cmake_minimum_required(VERSION 3.13.4)

set( CMAKE_CXX_STANDARD 11 )
set( CMAKE_CXX_STANDARD_REQUIRED TRUE )
set( CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11" )

project( Stitch )

find_package( OpenCV REQUIRED )
#find_package( glm REQUIRED )

find_library(GLES2-lib GLESv2)

include_directories( . )
file( COPY ${CMAKE_CURRENT_SOURCE_DIR}/resources DESTINATION ${CMAKE_CURRENT_BINARY_DIR} )
file( GLOB SOURCES "./*.cpp" )
add_executable( ${PROJECT_NAME} ${SOURCES} )

#add_subdirectory( Adder )

find_package(Git QUIET)
if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
# Update submodules as needed
    option(GIT_SUBMODULE "Check submodules during build" ON)
    if(GIT_SUBMODULE)
        message(STATUS "Submodule update")
        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
                        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                        RESULT_VARIABLE GIT_SUBMOD_RESULT)
        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            message(FATAL_ERROR "git submodule update --init failed with ${GIT_SUBMOD_RESULT}, please checkout submodules")
        endif()
    endif()
endif()

#           CHECK ALL THE SUBMODULES
if(NOT EXISTS "${PROJECT_SOURCE_DIR}/external/glfw/CMakeLists.txt")
    message(FATAL_ERROR "The glfw submodules was not downloaded! GIT_SUBMODULE was turned off or failed. Please update submodules and try again.")
endif()


add_subdirectory( external/glfw )
add_subdirectory( external/glm )

target_include_directories( ${PROJECT_NAME} 
	#PUBLIC Adder 
	PUBLIC external/glfw/include
	PUBLIC external/glm
	PUBLIC external/stb
)

#target_link_directories(testsome PRIVATE $CMAKE_SOURCE_DIR/../../SomeLibDemo/cpp/build/)
target_link_directories( ${PROJECT_NAME}
	#PRIVATE Adder
	PRIVATE external/glfw/src
	PRIVATE external/glm
)
include_directories( ${OpenCV_INCLUDE_DIRS} )


target_link_libraries( ${PROJECT_NAME} PRIVATE 
	${OpenCV_LIBS}
	glfw
	glm::glm
	${GLES2-lib}
	#adder
)

#how to create adder library:
#add_library(mearlymath adder.cpp)