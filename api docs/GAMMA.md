API-GAMMA
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

####PushNoti JSON
    { 
        "type": "type", (attendance_will_start, attendance_started, attendance_on_going, attendance_checked, clicker_started, clicker_on_going, notice_created, notice_updated, curious_commented, added_as_manager, course_created, etc)
        "course_id: : "course_id",
        "title" : "title",
        "message": "message"
    }

####Email JSON
    { 
        "email": "email"
    }
####Locale
    Every API has locale for it's parameter.
=================

###Sockets
####put : api/sockets/connect => res.ok();
    email
    password

=================
###Users
####post : api/users/signup => UsersJSON
    full_name
    email
    password
    device_type
    device_uuid
    locale
####get : api/users/auto/signin => UsersJSON 
#####Status Code 
    401 : Auto Sign Out
    441 : Update Recommended
    442 : Update Required
#
    email
    password
    locale
    device_uuid
    device_type
    app_version
####post : api/users/signin => UsersJSON
    email
    password (unhashed)
    locale
    device_uuid
    device_type
####put : api/users/forgot/password => EmailJSON
    email
    locale
####put : api/users/update/password => UsersJSON
    email
    password
    locale
    password_old
    password_new
####put : api/users/update/full_name => UsersJSON
    email
    password
    locale
    full_name
####put : api/users/update/email => UsersJSON
    email
    password
    locale
    email_new
####get : api/users/search => SimpleUsersJSON
    email
    password
    locale
    search_id
####get : api/users/courses => CourseJSON + attendance_rate, clicker_rate, notice_rate, notice_unseen ***
    email
    password
    locale

###Devices
####put : api/devices/update/notification_key => UsersJSON
    email
    password
    locale
    device_uuid
    notification_key

###Settings
####put : api/settings/update/attendance => UsersJSON
    email
    password
    locale
    attendance

####put : api/settings/update/clicker => UsersJSON
    email
    password
    locale
    clicker

####put : api/settings/update/notice => UsersJSON
    email
    password
    locale
    notice

####put : api/settings/update/curious => UsersJSON
    email
    password
    locale
    curious

####put : api/settings/update/clicker/defaults => UsersJSON
    email
    password
    locale
    progress_time
    show_info_on_select
    detail_privacy

###Questions
####get : api/questions/mine => QuestionsJSON LIST
    email
    password
    locale

####post : api/questions/create => QuestionsJSON
    email
    password
    locale
    message
    choice_count
    progress_time
    show_info_on_select
    detail_privacy

####put : api/questions/edit => QuestionsJSON
    email
    password
    locale
    question_id
    message
    choice_count
    progress_time
    show_info_on_select
    detail_privacy

####delete : api/questions/remove => QuestionsJSON
    email
    password
    locale
    question_id

###Identifications
####put : api/identifications/update/identity => UsersJSON
    email
    password
    locale
    school_id
    identity

###Schools
####post : api/schools/create => SchoolsJSON
    email
    password
    locale
    name
    type
####get : api/schools/all => SchoolsJSON LIST
    email
    password
    locale
####put : api/schools/enroll => UsersJSON
    email
    password
    locale
    school_id
    identity

###Courses
####get : api/courses/info => CoursesJSON + attendance_rate, clicker_rate, notice_rate, notice_unseen ***
    email
    password
    locale
    course_id
####post : api/courses/create/instant => UsersJSON
    email
    password
    locale
    name
    school_id
    professor_name
####get : api/courses/search => CoursesJSON
    email
    password
    locale
    course_id
    course_code
####put : api/courses/attend => UsersJSON
    email
    password
    locale
    course_id
####put : api/courses/dettend => UsersJSON
    email
    password
    locale
    course_id
####get : api/courses/feed => PostsJSON LIST
    email
    password
    locale
    course_id
    page
####put : api/courses/open => UsersJSON
    email
    password
    locale
    course_id
####put : api/courses/close => UsersJSON
    email
    password
    locale
    course_id
####put : api/courses/add/manager => CoursesJSON
    email
    password
    locale
    manager
    course_id
####get : api/courses/students => SimpleUsersJSON LIST + student_id + course_id
    email
    password
    locale
    course_id
####get : api/courses/attendance/grades => SimpleUsersJSON LIST + grade (string count/total) + student_id + course_id
    email
    password
    locale
    course_id
####get : api/courses/clicker/grades => SimpleUsersJSON LIST + grade (string count/total) + student_id + course_id
    email
    password
    locale
    course_id
####put : api/courses/export/grades => EmailJSON
    email
    password
    locale
    course_id
####put : api/courses/update/beginDate => CoursesJSON
    email
    password
    locale
    course_id
    beginDate
####put : api/courses/update/endDate => CoursesJSON
    email
    password
    locale
    course_id
    endDate

###ClickerQuestions
####get : api/clickerQuestions/course => ClickerQuestionsJSON LIST
    email
    password
    locale
    course_id

####post : api/clickerQuestions/create => ClickerQuestionsJSON
    email
    password
    locale
    course_id
    message
    choice_count
    progress_time
    show_info_on_select
    detail_privacy

####put : api/clickerQuestions/edit => ClickerQuestionsJSON
    email
    password
    locale
    clicker_question_id
    message
    choice_count
    progress_time
    show_info_on_select
    detail_privacy

####delete : api/clickerQuestions/remove => ClickerQuestionsJSON
    email
    password
    locale
    clicker_question_id

###AttendanceAlarms
####get : api/attendanceAlarms/course => AttendanceAlarmsJSON LIST
    email
    password
    locale
    course_id

####post : api/attendanceAlarms/schedule/create => AttendanceAlarmsJSON
    email
    password
    locale
    course_id
    schedule_id

####delete : api/attendanceAlarms/schedule/remove => AttendanceAlarmsJSON
    email
    password
    locale
    course_id
    schedule_id

####put : api/attendanceAlarms/schedule/sync => AttendanceAlarmsJSON LIST
    email
    password
    locale
    course_id

####post : api/attendanceAlarms/create/manual => AttendanceAlarmsJSON
    email
    password
    locale
    course_id
    scheduled_at

####delete : api/attendanceAlarms/remove/manual => AttendanceAlarmsJSON
    email
    password
    locale
    attendance_alarm_id

####put : api/attendanceAlarms/on => AttendanceAlarmsJSON
    email
    password
    locale
    attendance_alarm_id

####put : api/attendanceAlarms/off => AttendanceAlarmsJSON
    email
    password
    locale
    attendance_alarm_id

###Schedules
####post : api/schedules/create => SchedulesJSON
    email
    password
    locale
    course_id
    day
    time
    timezone
####delete : api/schedules/remove => SchedulesJSON
    email
    password
    locale
    schedule_id

###Posts
####post : api/posts/start/attendance => PostsJSON
    email
    password
    locale
    course_id
    type
####post : api/posts/start/clicker => PostsJSON
    email
    password
    locale
    course_id
    message
    choice_count
    progress_time
    show_info_on_select
    detail_privacy
####post : api/posts/create/notice => PostsJSON
    email
    password
    locale
    course_id
    message
####post : api/posts/create/curious => PostsJSON
    email
    password
    locale
    course_id
    message
####post : api/posts/create/curious => PostsJSON
    email
    password
    locale
    course_id
    message
####put : api/posts/update/message => PostsJSON
    email
    password
    locale
    post_id
    message
####delete : api/posts/remove => PostsJSON
    email
    password
    locale
    post_id
####put : api/posts/seen => PostsJSON
    email
    password
    locale
    post_id

###Comments
####get : api/comments/curious => CommentsJSON List
    email
    password
    locale
    curious_id

####post : api/comments/create => CommentsJSON
    email
    password
    locale
    post_id
    message

####put : api/comments/edit => CommentsJSON
    email
    password
    locale
    comment_id
    message

####delete : api/comments/remove => CommentsJSON
    email
    password
    locale
    comment_id

###Attendances
####get : api/attendances/from/courses => AttendancesJSON.id List
    email
    password
    locale
    course_ids
####put : api/attendances/found/device => AttendancesJSON
    email
    password
    locale
    attendance_id
    uuid
####put : api/attendances/toggle/manually => AttendancesJSON
    email
    password
    locale
    attendance_id
    user_id

###Clickers
####put : api/clickers/click => ClickersJSON
    email
    password
    locale
    clicker_id
    choice_number (1,2,3,4,5)

###Notices
####put : api/notices/seen => NoticesJSON
    email
    password
    locale
    notice_id

###Curiouses
####put : api/curiouses/like => CuriousesJSON
    email
    password
    locale
    curious_id

####put : api/curiouses/unlike => CuriousesJSON
    email
    password
    locale
    curious_id

####put : api/curiouses/follow => CuriousesJSON
    email
    password
    locale
    curious_id

####put : api/curiouses/unfollow => CuriousesJSON
    email
    password
    locale
    curious_id

=================

###Tutorial
####
####view : tutorial/clicker
    locale
    device_type
    app_version
####view : tutorial/attendance
    locale
    device_type
    app_version
####view : tutorial/notice
    locale
    device_type
    app_version

=================
####Copyright 2014 @Bttendance Inc.
