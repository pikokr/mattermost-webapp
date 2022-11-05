#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR

set -x

if [ -d twemoji ]; then
cd twemoji
git pull origin master
cd ..
else
git clone https://github.com/twitter/twemoji
fi

rm -rf images/emoji/*.svg

cp twemoji/assets/svg/*.svg images/emoji
