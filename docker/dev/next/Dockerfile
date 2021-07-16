FROM node:alpine3.11

WORKDIR /usr/app

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

USER node:node

CMD /wait && npx next telemetry disable && npm run dev
