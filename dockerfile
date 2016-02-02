# vim: set ft=Dockerfile:
FROM dockertr.es.ad.adp.com/ohcm_devops/nodejs-buildtools:0.12.4

ENV HOME=/srv/package
WORKDIR ${HOME}
EXPOSE 3000

USER root

# Copy in the stuff we hope doesn't change
COPY ./node_modules ${HOME}/node_modules/

# Copy the stuff which might change a bit more
COPY ./package.json ${HOME}/package.json

# Copy the stuff which we imagine may have changed - if we are doing a build
COPY ./app.js ${HOME}/app.js

# This doesn't change - but would invalidate sister builds with similar layers
CMD [ "/usr/local/bin/npm", "start" ]

ENV SERVICE_3000_NAME=couchbase-perf \
    SERVICE_3000_TAGS=discoverable
