API
=================
###User
####post : api/user/signup => UserJSON
    full_name
    username
    email
    password
    device_type
    device_uuid
####get : api/user/signin => UserJSON
    username or email
    password
    device_uuid
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
####get : api/user/schools => SchoolJSON LIST
    username
    password
####get : api/user/courses => CourseJSON LIST
    username
    password
####put : api/user/attend/course => UserJSON
    username
    password
    course_id
###Course
####post : api/course/create => CourseJSON
    username
    password
    name
    number
    school_id
####get : api/course/feed => PostJSON LIST
    username
    password
    course_id
    page
####get : api/course/students => UserJSON LIST
    username
    password
    course_id
####get : api/course/grades => List of { User_id + grade (ex "a/b") }
    username
    password
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
####get : api/serial/validate => ValidateJSON
    serial
    school_id
####post : api/serial/request => ValidateJSON
    email
