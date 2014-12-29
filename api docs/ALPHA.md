API-ALPHA
=================
##This API(alpha) has been Deprecated
###User
####post : api/user/signup => UserJSON
    full_name
    username
    email
    password
    device_type
    device_uuid
####get : api/user/auto/signin => UserJSON
    username
    password
    device_uuid
####get : api/user/signin => UserJSON
    username or email
    password (unhashed)
    device_uuid
####put : api/user/forgot/password => UserJSON
    email
####put : api/user/update/notification_key => UserJSON
    username
    password
    device_uuid
    notification_key
####put : api/user/update/profile_image => UserJSON
    username
    password
    device_uuid
    profile_image
####put : api/user/update/email => UserJSON
    username
    password
    device_uuid
    email
####put : api/user/update/full_name => UserJSON
    username
    password
    device_uuid
    full_name
####get : api/user/feed => PostJSON LIST
    username
    password
    page
####get : api/user/courses => CourseJSON LIST + grade (integer percent)
    username
    password
####get : api/user/schools => SchoolJSON LIST
    username
    password
####put : api/user/attend/course => UserJSON
    username
    password
    course_id
####put : api/user/employ/school => UserJSON
    username
    password
    school_id
    serial
####put : api/user/enroll/school => UserJSON
    username
    password
    school_id
    student_id
####get : api/user/search/user => UserJSON
    username
    password
    search_id

###School
####get : api/school/all => SchoolJSON LIST
    username
    password
####get : api/school/courses => CourseJSON LIST
    username
    password
    school_id

###Course
####post : api/course/create => CourseJSON
    username
    password
    name
    number
    school_id
    professor_name
####get : api/course/feed => PostJSON LIST
    username
    password
    course_id
    page
####get : api/course/students => UserJSON LIST
    username
    password
    course_id
####get : api/course/grades => List of { user_id + full_name + student_id + grade (ex "a/b") }
    username
    password
    course_id
####put : api/course/add/manager => CourseJSON
    username
    password
    manager
    course_id

###Post
####post : api/post/create => PostJSON
    username
    password
    type
    title
    message
    course_id
####post : api/post/attendance/start => CourseJSON
    username
    password
    course_id
####put : api/post/attendance/found/device => PostJSON
    username
    password
    post_id
    uuid
####put : api/post/attendance/check/manually => PostJSON
    username
    password
    post_id
    user_id
####post : api/post/create/notice => PostJSON
    username
    password
    course_id
    message

###Serial
####get : api/serial/validate => SchoolJSON
    serial
####post : api/serial/request => SerialJSON
    email
=================
####Copyright 2014 @Bttendance Inc.
