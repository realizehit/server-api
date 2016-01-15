FROM cusspvz/node:0.12.9
MAINTAINER José Moreira <jose.moreira@findhit.com>

ARG NODE_ENV=production
ADD . /app
RUN npm install
CMD [ "start" ]
