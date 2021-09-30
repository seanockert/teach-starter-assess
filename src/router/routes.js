import { BASE_URL } from '@/variables';

// Set up possible routes
// Components are imported, instead of directly defined.
// This allows webpack to split the JS bundle by route and lazy load each route as it's accessed
const routes = [
  {
    path: '/',
    redirect: BASE_URL,
  },
  {
    path: BASE_URL,
    exact: true,
    name: 'Activity List',
    component: () => import('@/modules/assessment/index.vue'),
    meta: {
      title: 'Assess',
      description: 'View and edit your assessments',
    },
  },
  {
    path: BASE_URL + 'publishing',
    name: 'Publishing',
    component: () => import('@/modules/publishing/index.vue'),
    meta: {
      title: 'Published Activities',
      description: 'Manage your published activities',
    },
  },
  {
    path: BASE_URL + 'edit/:assessmentSlug',
    name: 'Activity Editor',
    component: () => import('@/modules/editor/index.vue'),
    meta: {
      title: 'Edit activity',
      description: 'Edit activity',
    },
  },
  {
    path: BASE_URL + 'settings/:assessmentSlug',
    name: 'Activity Settings',
    component: () => import('@/modules/settings/index.vue'),
    meta: {
      title: 'Activity Settings',
      description: 'Change activity outcome, theme, and more',
    },
  },
  {
    path: BASE_URL + 'view/:studentAssessmentSlug',
    name: 'Activity Preview',
    component: () => import('@/modules/player/index.vue'),
    meta: {
      title: 'Preview activity',
      description: 'Preview activity',
    },
  },
  {
    path: BASE_URL + 'print/:assessmentSlug',
    name: 'Activity Print Preview',
    component: () => import('@/modules/assign/SharePrint.vue'),
    meta: {
      title: 'Preview activity',
      description: 'Preview print version of activity',
    },
  },
  {
    path: BASE_URL + 'template/:assessmentSlug',
    name: 'Activity Template Preview',
    component: () => import('@/modules/template/index.vue'),
    meta: {
      title: 'Activity Template',
      description: 'Copy this activity template to use for your class',
    },
  },
  {
    path: BASE_URL + 'assign/:assessmentSlug',
    name: 'Activity Assign',
    component: () => import('@/modules/assign/index.vue'),
    meta: {
      title: 'Assign Activity',
      description: 'Assign activity to your class, share, or print',
    },
  },
  {
    path: BASE_URL + 'results/:assessmentSlug',
    name: 'Activity Results',
    component: () => import('@/modules/result/index.vue'),
    meta: {
      title: 'Activity Results',
      description: 'View the results of this activity',
    },
  },
  {
    path: BASE_URL + 'result/:resultSlug',
    name: 'Activity Result View',
    component: () => import('@/modules/result/AssessmentResultsView.vue'),
    meta: {
      title: 'Student Result',
      description: 'View the results of this activity',
    },
  },
  {
    path: '/login',
    exact: true,
    name: 'Teacher Login',
    component: () => import('@/modules/login/index.vue'),
    meta: {
      title: 'Login to Assess',
      description: 'Sign in as a teacher',
      public: true,
    },
  },
  {
    path: BASE_URL + 'monitor',
    name: 'Monitor',
    component: () => import('@/modules/monitor/index.vue'),
    meta: {
      title: 'Results',
      description: 'View all of your student results',
    },
  },
  {
    path: BASE_URL + 'monitor/view/:studentId',
    name: 'Monitor Student',
    component: () => import('@/modules/monitor/MonitorStudent.vue'),
    meta: {
      title: 'Student Results',
      description: 'View the results of this student',
    },
  },
  {
    path: BASE_URL + 'students',
    name: 'Students and Classes',
    component: () => import('@/modules/students/index.vue'),
    meta: {
      title: 'Students & Classes',
      description: 'Edit students and classes',
    },
  },
  {
    path: '/student/login',
    exact: true,
    name: 'Student Login',
    component: () => import('@/modules/student/login.vue'),
    meta: {
      title: 'Student Login',
      description: 'Login to take activities',
      public: true,
    },
  },
  {
    path: '/student/:studentId?',
    exact: true,
    name: 'Student Activity List',
    component: () => import('@/modules/student/index.vue'),
    meta: {
      title: 'Student',
      description: 'View your activities',
    },
  },
  {
    path: '/student/view/:studentAssessmentSlug',
    exact: true,
    name: 'Student Activity Player',
    component: () => import('@/modules/student/player/index.vue'),
    meta: {
      title: 'Activity',
      description: 'Take this activity',
    },
  },
  {
    path: BASE_URL + 'share-activity/:shareToken',
    exact: true,
    name: 'Shared Activity',
    component: () => import('@/modules/share/index.vue'),
    meta: {
      title: 'Shared Activity',
      description: 'Shared activity details',
      public: true,
    },
  },
  {
    path: '*',
    name: 'Not Found',
    component: () => import('@/modules/NotFound.vue'),
    meta: {
      title: 'Page not found',
      description: '404 not found',
      public: true,
    },
  },
];

export default routes;
