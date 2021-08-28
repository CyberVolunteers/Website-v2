FROM node:alpine3.11

WORKDIR /usr/app

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

# for sharp
# RUN apk add vips
RUN apk add python build-base
# RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev
# NOTE: you need to install sharp from the container so that it downloads the correct version

USER node:node

CMD /wait && npx next telemetry disable && npm run dev
