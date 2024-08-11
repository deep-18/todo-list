cd /app

# install dependencies
npm install
npm start
cp -r build/* /var/www/html
npm install pm2 -g