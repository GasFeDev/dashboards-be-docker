# GASFEDEV Dashboard Backend

## Run

Configure .env file with corresponding values.

Run the folling command, make sure to have MongoDB instace up and running: 

``` npm run dev ``` 

#### Server

1.- folder -> /opt/repos/dashboard-be
2.- run pm2 start npm --name "dashboard-be" -- start
3- sudo git checkout deploy/uat
4.-sudo git pull

In case of update.

1.- sudo git pull
2.- pm2 restart APP_ID or APP_NAME , in this case you canse use 0 as id


Other usefulls commands:

- pm2 stop 0
- pm2 delete 0
- pm2 restart 0


