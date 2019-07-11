#Dockerfile
FROM node:10 

WORKDIR '/ave-mario'

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY .  /ave-mario

EXPOSE 6105

CMD ["npm", "start"]