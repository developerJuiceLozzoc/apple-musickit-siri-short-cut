#!/bin/bash
echo $1 >> ./temp/sirirequests.txt

/Users/lozzoc/.nvm/versions/node/v18.15.0/bin/node ./index.js $1
