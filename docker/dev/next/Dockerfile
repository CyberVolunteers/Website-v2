FROM node:alpine

RUN mkdir /usr/app
WORKDIR /usr/app

COPY --chown=node:node ./package.json /usr/app/

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

# for sharp
#RUN apk add vips
RUN apk add build-base
# RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/
# RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev
#RUN npm install --platform=linuxmusl sharp

# RUN apt-get update
# RUN apt-get install -y libvips

# RUN npm install sharp
# RUN npm install --unsafe-perm --ignore-scripts=false sharp

RUN npm install --unsafe-perm

USER node:node

CMD /wait && npx next telemetry disable && npm run dev
