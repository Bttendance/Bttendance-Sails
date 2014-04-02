Bttendance
=================
Bttendance is bluetooth based attedance check application. 

We've started this service from 2013/11/01. 

This app uses "Sails.js" as framework and "Java Script" as language.

##Guide Line
=================
####Model
- Attribute doesn't contain Capital Letter.
- Attribute uses '_' as space between words.
- User Model is for Access (which includes username, email, password, access_token, etc)
- Every Model is associated via waterline association.
- Some Model is associcated via array of id.

####API
- API Schema : 'api/:controller/:action/:model' (ex : 'api/user/join/school')
- Controller Action : ':action_:model' (ex : join_school)
- Route : 'api/:controller/:action/:model' to ':action_:model'
- Every API requires username, password
=================
####Install & Run
    $ git clone git@github.com:Bttendance/Bttendance-NodeJS.git
    $ sudo npm install -g sails
    $ sudo npm install
    $ sails lift

####npm codes
    $ sudo npm prune
    $ rm -rf node_modules
    $ sudo npm uninstall -g sails
    $ npm view sails version

####node & sails lift codes
    $ node app.js
    $ node app.js —prod --port 7331
    $ sails lift
    $ sails lift --prod --port 7331
    $ forever start -c nodemon app.js
    $ forever start -c nodemon app.js —prod —port 7331

####Heroku codes
    $ heroku logs —app bttendance-dev
    $ heroku logs —app bttendance
    $ heroku accounts
    $ heroku accounts:set thefinestartist
    $ heroku pgbackups:restore HEROKU_POSTGRESQL_MAROON 'https://s3-ap-northeast-1.amazonaws.com/herokubackup/b021.dump' --app bttendance-dev
    
####Install Postgres
    $ brew update
    $ brew doctor
    $ brew install postgresql
    $ initdb /usr/local/var/postgres -E utf8
    
####Setting Postgres
    $ touch ~/.bash_profile
    $ vi ~/.bash_profile
    add folowing lines to .bash_profile
    alias pgs='pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start'
    pgq='pg_ctl -D /usr/local/var/postgres stop -s -m fast'

####Create Local DB
    $ initdb postgres
    $ pg_ctl start -D Postgres
    $ pg_ctl stop -D Postgres
    $ pg_restore --verbose --clean --no-acl --no-owner -h localhost -U TheFinestArtist -d postgres b026.dump
    
####Connect to Postgres DB
    $ psql "dbname=d8n4i2f6q5clp2 host=ec2-54-225-88-13.compute-1.amazonaws.com user=u7nsa3j4q3ng05 password=pf3koh48m9br384km90u7kng962 port=5642 sslmode=require"
    $ psql "dbname=dc7df0gak3bkvh host=ec2-54-197-241-97.compute-1.amazonaws.com user=mpurikshxalrea password=8n2N7DlIeC5CaZyQMHuk4C8f1s port=5432 sslmode=require"
    $ psql "dbname=postgres"

####psql codes
    $ SELECT id, courses_managers, users_supervising_courses FROM courses_managers__users_supervising_courses;
    $ \d+ courses_managers__users_supervising_courses;
    $ \dt
    $ \du
    $ \q
    $ DROP TABLE users, courses, posts, devices, schools, serials, attendances, clickers, courses_managers__users_supervising_courses, courses_students__users_attending_courses, schools_professors__users_employed_schools, schools_students__users_enrolled_schools, identifications, serials_owners__users_serials;

####git codes
    $ git branch
    $ git remote
    $ git remote add origin git@github.com:Bttendance/Bttendance-NodeJS.git
    $ git remote add bttd-dev git@heroku.com:bttendance-dev.git
    $ git remote add bttd git@heroku.com:bttendance.git
    $ git push origin master
    $ git push bttd-dev master
    $ git push bttd master

    $ git checkout old
    $ git push origin old
    $ git remote add bttd-old git@heroku.com:bttendance-old.git
    $ git push bttd-old old:master

##Developer

####The Finest Artist
- Email : thefinestartist@bttendance.com
- Phone : +82-10-7755-4400

####Copyright 2014 @Bttendance Inc.
