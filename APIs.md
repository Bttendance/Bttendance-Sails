API
=================
API Schema for Bttendance
###User
####post : api/user/signup => UserJSON
    full_name
    username
    email
    password
    device_type
    device_uuid
    type
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
####put : api/user/join/school => UserJSON
    username
    password
    school_id
####put : api/user/join/course => UserJSON
    username
    password
    course_id
####get : api/user/schools => SchoolJSON LIST
    username
    password
####get : api/user/courses => CourseJSON LIST
    username
    password
####get : api/user/joinable/courses => CourseJSON LIST
    username
    password
####get : api/user/feed => PostJSON LIST
    username
    password
    page
###School
####post : api/school/create => SchoolJSON
    username
    password
    name
    website
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
####put : api/post/attendance/current/location => PostJSON
    username
    password
    post_id
    latitude
    longitude
####get : api/post/student/list => UserJSON LIST
    username
    password
    post_id
###Serial
####get : api/serial/validate => ValidateJSON
    serial
