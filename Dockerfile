FROM node:16.14.2-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN mkdir log
RUN cd log
RUN touch access.log
RUN touch error.log
RUN cd ..
RUN mkdir public
RUN cd public
RUN mkdir images
RUN cd ../../

COPY package*.json ./

RUN npm install --silent
RUN npm install -g ts-node

COPY . .

EXPOSE 5000

CMD ["npm","start"]
