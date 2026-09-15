export function buildAuthQuery({ redirect, enrollCourse } = {}) {
    const params = new URLSearchParams();
    if (redirect) {
        params.set('redirect', redirect);
    }
    if (enrollCourse) {
        params.set('enroll_course', enrollCourse);
    }
    const query = params.toString();

    return query ? `?${query}` : '';
}

export function authRoute(routeName, { redirect, enrollCourse, course } = {}) {
    let targetRedirect = redirect;
    let targetEnrollCourse = enrollCourse;

    if (course?.slug && course?.id) {
        targetRedirect = targetRedirect ?? route('explore.show', course.slug);
        targetEnrollCourse = targetEnrollCourse ?? course.id;
    }

    return route(routeName) + buildAuthQuery({
        redirect: targetRedirect,
        enrollCourse: targetEnrollCourse,
    });
}

export function loginForCourse(course) {
    return authRoute('login', { course });
}

export function registerForCourse(course) {
    return authRoute('register', { course });
}
