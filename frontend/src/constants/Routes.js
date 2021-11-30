export const ROUTE = {
  HOME: "/",
  LOGIN: "/login",
  // Students
  STUDENTS: "/students",
  STUDENTS_ADD: "/students/add/:id?",
  STUDENTS_PROFILE: "/profile",
  // Department
  DEPARTMENTS: "/departments",
  DEPARTMENTS_ADD: "/departments/add/:id?",
  DEPARTMENTS_SUBJECT_ADD: "/departments/subject/:id",
  DEPARTMENTS_DETAILS: "/departments/show/:id",

  // SUBJECT
  SUBJECTS: "/subjects",
  SUBJECT_BY_ID: "/subject/:id",
  SUBJECTS_ADD: "/subjects/add/:id?",

  // YEAR
  YEARS: "/years",
  YEARS_ADD: "/years/add/:id?",
  YEARS_SEMESTERS: "/years/:id?/semesters",

  // semesters
  SEMESTERS: "/semesters",
  SEMESTERS_ADD: "/semesters/add/:id?",
  SEMESTERS_COURSES: "/semesters/:id?/courses",

  // Courses
  COURSES: "/courses",
  COURSES_ADD: "/courses/add/:id?",

  // Enrollments
  ENROLLMENTS: "/enrollments",
  // Admin Enrollments
  ENROLLMENTS_DETAILS: "/enrollments/show/:id",
};
