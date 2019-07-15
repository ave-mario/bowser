#!/bin/bash

app="api-redis"
redis =  docker ps  -f name="$app"
if  [ -z "$redis"]; then
  docker run -p 6379:6379 --name "$app" -d redis:5 
 else if docker ps -a -f "name=$app"; then
   docker restart "$app"
  fi
fi