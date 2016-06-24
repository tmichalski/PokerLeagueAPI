docker run \
-p 8080:8080 \
-d \
-e NODE_ENV='production' \
-e FACEBOOK_APP_ID='' \
-e FACEBOOK_APP_SECRET='' \
-e RDS_HOSTNAME='127.0.0.1' \
-e RDS_USERNAME='' \
-e RDS_PASSWORD='' \
-e RDS_PORT=3306 \
poker-league-api
