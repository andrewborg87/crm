# KrakenD
################################################
FROM cubejs/cube:v1.0.13 AS production

# Use this location for subsequent commands
WORKDIR /cube/conf

# Copy the required files
COPY ./apps/cube/model ./model
COPY ./apps/cube/cube.js ./cube.js
COPY ./apps/cube/package.json ./package.json

# Install dependencies
RUN npm i

# Expose the right port
EXPOSE 3031
EXPOSE 4000
################################################