# Documentation:
# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

# Use NodeJS:
FROM node:12-slim
# Disable debugging & enable optimizations:
ENV NODE_ENV=production

# Node.js was not designed to run as PID 1 which leads to unexpected behaviour when running inside of Docker.
# For example, a Node.js process running as PID 1 will not respond to SIGINT (CTRL-C) and similar signals.
# To compensate, we run with a lightweight init system called Tini:
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Create a working directory
WORKDIR /home/node/api
# Make it so working directory can be accessed without root permissions
RUN ["chmod", "-R", "777", "/home/node"]

# For security reasons, don't run as root user. The `node` user is provided by the node image by default.
USER node

# Set up ports.
# Since we're not running as root, we can't use HTTP ports 443 or 80 directly.
# Instead, we expose an arbitrary port above 1024 and redirect to it.
# Use `-p 3000:80` to redirect port 80 of the host to 3000 of the image.
ENV PORT 3000
EXPOSE ${PORT}
# discord.js port
EXPOSE 3306

COPY ./src .
COPY ./package.json .
RUN npm i
CMD ["node", "index.js"]
