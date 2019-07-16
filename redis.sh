#!/bin/bash

exec 2>redis.sh.log.txt
app="api-redis"
  docker stop $app
  docker rm $app 
  docker run -p 6379:6379 --name $app -d redis:5 