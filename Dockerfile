#Dockerfile
FROM node:10 

WORKDIR '/ave-mario'

COPY package*.json ./

RUN npm install

COPY .  /ave-mario

EXPOSE 6105:6105

CMD ["npm", "start"]