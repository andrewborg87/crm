# KrakenD
################################################
FROM devopsfaith/krakend:2.9.2 AS production

# Use this location for subsequent commands
WORKDIR /etc/krakend

# Install curl & ca-certificates
RUN apk add --no-cache curl ca-certificates

# Copy the required files
COPY ./apps/gateway/krakend.tmpl .
COPY ./apps/gateway/config ./config

# Setup env
ENV PORT=8080
ENV FC_ENABLE=1
ENV FC_PARTIALS=config/partials
ENV FC_SETTINGS=config/services
ENV FC_OUT=krakend.json

# Set Permissions
RUN chown 1000:1000 -R /etc/krakend

# Expose the right port & start krakenD
EXPOSE 8080
EXPOSE 9090

CMD [ "run", "-c", "/etc/krakend/krakend.tmpl", "-p", "8080" ]
################################################