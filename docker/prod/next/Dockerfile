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

USER node:node

RUN npm i
RUN export NODE_ENV=production
RUN npx next telemetry disable
RUN npm run lint
RUN npm run build

CMD /wait && NODE_ENV=production npm run start
