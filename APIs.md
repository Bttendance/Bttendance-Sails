API
=================
API Schema for Bttendance
###User
####api/user/signup (post)
    full_name
    username
    email
    password
    device_type
    device_uuid
    type
####api/user/signin (get)
    username or email
    password
    device_uuid
####api/user/schools (get)
    username
    password
####api/user/courses (get)
    username
    password
###Course
####api/course/create (post)
    username
    password
    name
    school_id
###Post
####api/post/create (post)
    username
    password
    title
    message
    course_id
###Serial
####api/serial/validate (get)
    serial
