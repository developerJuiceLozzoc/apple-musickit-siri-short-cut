#!/bin/bash
echo $1 >> ./temp/sirirequests.txt

node index.js $1
