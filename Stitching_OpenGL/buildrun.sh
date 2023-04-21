#! /bin/sh
rm -rf out/build/resources
cp -R ./resources ./out/build/
cd out/build
make
cd ../..
./run.sh
