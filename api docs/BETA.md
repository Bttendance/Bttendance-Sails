API-BETA
=================
###JSON TYPE
####WHOLE JSON 
    Populating whole attribute using toWholeObject()
####SIMPLE JSON
    Un-Populating whole attribute using toJSON()
=================
####Error JSON
    { 
        "type" : "type", (log, toast, alert)
        "title": "title",
        "message": "message"
    }

####Notification JSON
    { 
        "type": "type", (attendance_started, attendance_on_going, attendance_checked, clicker_started, clicker_on_going, notice, added_as_manager, course_created, etc)
        "title" : "title",
        "message": "message"
    }

####Email JSON
    { 
        "email": "email"
    }
=================
###Users
####post : api/users/signup => UsersJSON
    full_name
    username
    email
    password
    device_type
    device_uuid
####get : api/users/auto/signin => UsersJSON 
#####Status Code 
    401 : Auto Sign Out
    441 : Update Recommended
    442 : Update Required
#
    username
    password
    device_uuid
    device_type
    app_version
####get : api/users/signin => UsersJSON
    username or email
    password (unhashed)
    device_uuid
####put : api/users/forgot/password => EmailJSON
    email
####put : api/users/update/profile_image => UsersJSON
    username
    password
    device_uuid
    profile_image
####put : api/users/update/full_name => UsersJSON
    username
    password
    device_uuid
    full_name
####put : api/users/update/email => UsersJSON
    username
    password
    device_uuid
    email
####get : api/users/feed => PostsJSON LIST + grade (integer percent)
    username
    password
    page
####get : api/users/courses => CourseJSON LIST + grade (integer percent)
    username
    password
####get : api/users/search => SimpleUsersJSON
    username
    password
    search_id

###Devices
####put : api/devices/update/notification_key => UsersJSON
    username
    password
    device_uuid
    notification_key

###Schools
####get : api/schools/all => SchoolsJSON LIST
    username
    password
####get : api/schools/courses => CoursesJSON LIST
    username
    password
    school_id
####put : api/schools/enroll => UsersJSON
    username
    password
    school_id
    student_id

###Courses
####post : api/courses/create/request => EmailJSON
    username
    password
    name
    number
    school_id
    professor_name
####put : api/courses/attend => UsersJSON
    username
    password
    course_id
####put : api/courses/dettend => UsersJSON
    username
    password
    course_id
####get : api/courses/feed => PostsJSON LIST + grade (integer percent)
    username
    password
    course_id
    page
####get : api/courses/students => SimpleUsersJSON LIST + student_id
    username
    password
    course_id
####put : api/courses/add/manager => CoursesJSON
    username
    password
    manager
    course_id
####get : api/courses/grades => SimpleUsersJSON LIST + grade (string count/total) + student_id
    username
    password
    course_id
####put : api/courses/export/grades => EmailJSON
    username
    password
    course_id

###Posts
####post : api/posts/start/attendance => PostsJSON
    username
    password
    course_id
####post : api/posts/start/clicker => PostsJSON
    username
    password
    course_id
    message
    choice_count
####post : api/posts/create/notice => PostsJSON
    username
    password
    course_id
    message

###Attendances
####get : api/attendances/from/courses => AttendancesJSON.id List
    username
    password
    course_ids
####put : api/attendances/found/device => AttendancesJSON
    username
    password
    attendance_id
    uuid
####put : api/attendances/check/manually => AttendancesJSON
    username
    password
    attendance_id
    user_id

###Clickers
####put : api/clickers/connect => ClickersJSON
    username
    password
    socket_id
    clicker_id
####put : api/clickers/click => ClickersJSON
    username
    password
    clicker_id
    choice_number (1,2,3,4,5)

###Tokens
####post : api/verify/:token_key => Redirect
=================
####Copyright 2014 @Bttendance Inc.
