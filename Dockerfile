FROM node:18-alpine3.15

WORKDIR /app/ispo-dashboard-backend/

ENV PORT 4000

COPY ./package.json ./

RUN yarn install
RUN yarn global add ts-node
RUN yarn global add typescript

COPY . .

# Expose the PORT
EXPOSE $PORT

EXPOSE 27017

CMD [ "npm", "run", "start" ]