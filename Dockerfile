FROM node:10
#
#RUN apt-get update
#RUN apt-get -y install software-properties-common
#RUN add-apt-repository ppa:ubuntu-toolchain-r/test
#RUN apt-get update
#RUN apt-get -y install gcc-4.9
#RUN apt-get -y upgrade libstdc++6

#RUN apt-get install -y g++ libssl1.0.0 libssl-dev libz-dev liblua5.1-0-dev zlib1g-dev make
#RUN apt-get install -y g++ libssl-dev libz-dev zlib1g-dev make
#RUN ln -s /usr/lib/x86_64-linux-gnu/liblua5.1.so /usr/lib/liblua.so
#RUN ln -s /usr/lib/x86_64-linux-gnu/liblua5.1.a /usr/lib/liblua.a


#ENV AERO_C_VERSION 4.6.12
#
#RUN wget -O /tmp/aerospike-client-c.tgz https://www.aerospike.com/download/client/c/${AERO_C_VERSION}/artifact/debian9-libuv
#RUN tar zxvf /tmp/aerospike-client-c.tgz
#
#RUN echo "installing aeropskike c client"
#
#RUN dpkg -i aerospike-client-c-libuv-${AERO_C_VERSION}.debian9.x86_64/aerospike-client-c-libuv-${AERO_C_VERSION}.debian9.x86_64.deb
#RUN dpkg -i aerospike-client-c-libuv-${AERO_C_VERSION}.debian9.x86_64/aerospike-client-c-libuv-devel-${AERO_C_VERSION}.debian9.x86_64.deb
#
#ENV PREFIX /usr
#
#RUN rm -f /tmp/aerospike-client-c.tgz
#RUN rm -rf aerospike-client-c-libuv-${AERO_C_VERSION}.debian9.x86_64

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "app.js" ]