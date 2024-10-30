FROM ghcr.io/puppeteer/puppeteer:latest
WORKDIR /home/pptruser
COPY --chown=pptruser:pptruser ./package*.json .
RUN npm install
COPY --chown=pptruser:pptruser ./src .
CMD ["node","main.js"]
