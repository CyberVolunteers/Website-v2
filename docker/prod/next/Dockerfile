FROM node:alpine3.11

WORKDIR /usr/app
# perms for the root dir itself
RUN chown node:node /usr/app/
COPY --chown=node:node . /usr/app/


## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait


# for sharp
RUN apk add python build-base
# RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev
<<<<<<< HEAD
run apk add python
run apk add build-base
RUN npm i --unsafe-perm
=======

USER node:node

RUN npm i
>>>>>>> f3179f45699f2f5dc62df44fff4bba48bede177f
RUN npx next telemetry disable
RUN npm run build

RUN ls -la .

CMD /wait && npm run start
