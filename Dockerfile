FROM public.ecr.aws/docker/library/node:lts
WORKDIR /home/node
USER node
COPY --chown=node:node ./package*.json .
COPY --chown=node:node ./src .
RUN npm install
RUN npx puppeteer browsers install chrome
CMD ["node","main.js"]
