FROM node:6.2

# Update to latest OS libs
RUN apt-get -y update 

# Create app directory
RUN mkdir -p /usr/src/PokerLeagueAPI
WORKDIR /usr/src/PokerLeagueAPI

# Install app & dependencies
ADD ./PokerLeagueAPI/ /usr/src/PokerLeagueAPI/
RUN npm install

# Set the timezone to default to CST
RUN echo "America/Chicago" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# Start app
EXPOSE 8080
CMD npm start > /var/log/pokerleague-server.log

