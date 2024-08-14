#!/bin/bash
systemctl -l enable nginx
sudo systemctl stop nginx
sudo cp /var/www/react-app/nginx.conf /etc/nginx/nginx.conf
sudo systemctl start nginx