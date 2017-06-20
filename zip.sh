#!/bin/bash

rm -f void.tar.xz
rm -f epigen-archive.tar.xz
rm -rf epigen-archive

npm run build

mkdir -p release/public
cp index.html release/public/index.html
cp -r dist release/public/
cp -r public release/public/

tar --exclude "./epigen-archive.tar.xz" --exclude='./.git' --exclude='./node_modules' --exclude='./src' -cJf ./epigen-archive.tar.xz release

rm -rf release