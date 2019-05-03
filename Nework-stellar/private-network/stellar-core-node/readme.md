install postgres
sudo apt-get install postgresql postgresql-contrib

Set up the database 

sudo su postgres
psql
CREATE USER stellar WITH PASSWORD 'stellar';
ALTER USER stellar WITH SUPERUSER;
CREATE DATABASE core1;
GRANT ALL PRIVILEGES ON DATABASE core1 TO stellar;

stellar-core --newdb
stellar-core --forcescp

