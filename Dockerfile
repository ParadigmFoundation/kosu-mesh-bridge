FROM node:lts
WORKDIR /bridge

RUN yarn global add typescript

COPY . .
RUN yarn
RUN yarn build

CMD yarn start:production

