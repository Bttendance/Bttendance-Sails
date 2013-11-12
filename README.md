Bttendance
=================
Bttendance is bluetooth based attedance check application. 

We've started this service from 2013/11/01. 

This app uses "Sails.js" as framework and "Java Script" as language.

##Guide Line

####Install & Run
    $ git clone git@github.com:utopia-corperation/Bttendance-NodeJS.git
    $ sudo npm install
    $ sudo npm install -g sails
    $ sails lift
    
####Install Postgres (We are currently using mongo, so this is unnecessary)
    $ brew update
    $ brew doctor
    $ brew install postgresql
    $ initdb /usr/local/var/postgres -E utf8
    
    $ touch ~/.bash_profile
    $ vi ~/.bash_profile
    add folowing lines to .bash_profile
    alias pgs='pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start'
    pgq='pg_ctl -D /usr/local/var/postgres stop -s -m fast'
    
    $ initdb /usr/local/var/postgres

####Model

- Attribute doen't contain Capital Letter.
- Attribute uses '_' as space between words.
- Model overwrite 'MongoDB' object_id as integer which starts from 1.
- User Model is for Access (which includes username, email, password, access_token, etc)
- Professor & Student's 'id' is same as User 'id'.

####API
- CRUD API is only approved for admin security string (currently admin_access : 'asdf1234')

####View
- View uses 'jade' template.
- View uses 'bootstrap' from Twitter.

##Developer

####The Finest Artist
- Email : contact@thefinestartist.com
- Phone : +82-10-7755-4400

####Samchon
- Email : ysgenius88@gmail.com
- Phone : +82-10-8831-0006

####Copyright 2013 @Utopia Corporation


=================
####We Need Chached DB : http://aws.amazon.com/elasticache/
####Vingle is using Heroku Postgres & Memcached



