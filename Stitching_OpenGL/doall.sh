#! /bin/sh
rm -rf out/
cmake -S . -B out/build
cd out/build
make
cd ../..
./run.sh
