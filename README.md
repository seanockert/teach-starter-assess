# Teach Starter Assess

A web app for creating and taking Activities. Built with Vue.js using the Teach Starter API.

Consists of 2 parts:

1. `/assess` is the teacher experience where they can: create, share, mark, and see results for activities.
2. `/student` is where a student can log in and take their assigned activities.

## Note on Terminology

The app and backend were built using the term **assessment** to refer to the main object that a user creates. This term was changed to **activity** before release. These two terms are interchangable and refer to the same thing.

From a user perspective, all UI elements have be renamed activity/activities. This includes: buttons, labels, tooltips, table headers, confirmation messages, headers, descriptions, inputs, CSV exports. In addition, all Segment events have been renamed 'Activity'. The code refers to these items as 'assessments'. If this causes too much confusion in future, we may need to rename all variables and endpoints to match the new term.

## File structure

- `public`
  - `index.html` to load the app
  - `images`
- `src`
  - `assets` the styles that are shared across the app. Component-specific styles are scoped to their component in the .vue files
  - `modules` all the components
    - `activity` list of activities and templates (teacher)
    - `assign` assign an activity to students, share with a teacher, or print (teacher)
    - `common` shared components
    - `editor` activity builder (teacher)
    - `login` teacher login page (teacher)
    - `monitor` view all results (teacher)
    - `player` preview an activity (teacher)
    - `publishing` list of published activities (teacher)
    - `result` view and mark results for an activity (teacher)
    - `settings` activity builder settings (teacher)
    - `student` student login, list of activities, take activity (student)
    - `students` manage classes and students (teacher)
    - `template` view activity template (teacher)
  - `routes` defines the URL routing and API endpoints
  - `shared` functions imported by components and JSON templates for creating new activities and questions
  - `store` Vuex actions and mutations. Updates to the state and all communication with the API goes through here
    - `actions` make API calls with axios
    - `mutations` make changes to the state and local storage
    - `getters` retrieve state properties
  - `Assess.vue` main component to initialise the routing and styles. Consider splitting Assess and Students into 2 separate apps
  - `main.js` initialise the routing, plugins etc.
  - `variables.js` set the API endpoint and local storage keys
- `dist` base directory for serving the app. The app is compiled into this directory as distributable files via Webpack
- `vue.config.js` project is built with Vue-CLI. Loads \_variables.scss in every component so we can use variables in component styles

## Link

- **[Staging](https://staging-my.teachstarter.com/)**
- **[Production](https://my.teachstarter.com/)**

**Production login:**

Username: teachstarter Password: ts2020

## Sitemap

There's a rough [sitemap here](https://octopus.do/pci21e58om). Hasn't been updated in a while.

## Activities

An **Activity** consists of the a collection of **Questions**. Each Question stores Data (what the student sees) and Answers (the correct result):

- Activity
  - Question 1
    - Data
    - Answers
  - Question 2
    - Data
    - Answers
  - ...

When a Student views an activity, they only see a question's **Data**; the **Answers** are excluded.

When a Student first opens an activity, a **Result** is created, with a blank copy of each Question, with its Answer field ommitted. As the student progresses through the activity (clicking Next), each inputted result is stored with that question:

- Result
  - Questions
    - Question 1
      - Data
      - Results
    - Question 2
      - Data
      - Results
    - ...

An activity is considered **Submitted** when it is assigned a 'finished' date. Once submitted, each question in the result has its original answer appended. This is so we can store all the data together as one record, in case the original activity is changed or removed. The result now looks like:

- Result
  - Questions
    - Question 1
      - Data
      - Results
      - Answers
      - Marking
    - Question 2
      - Data
      - Results
      - Answers
      - Marking
    - ...

The result records now includes the answers. However, we don't want to show any answers to the student until the Result has been **Marked** by the teacher (ie. assigned a 'marked' date). An additional Marked field is added to hold the score and comment for each question.

## API

Set the API endpoint URL in `/src/variables.js`.

- [Local](http://localhost:9000/?v=2)
- [Staging](https://api-dev-staging.teachstarter.com/?v=2)
- Production (coming soon)

By default, the app will use staging API endpoints. If running a local instance of the API, set `VUE_APP_ENV=development` in your .env file. `VUE_APP_ENV=production` in .env to use the production API.

### Database

The app requires the following database tables (in addition to the user and auth tables):

- `assessment`
- `assessment_questions_join`
- `classroom`
- `classroom_students_join`
- `notifications`
- `question`
- `question_curriculumTags_join`
- `resource_curriculum`
- `result`
- `student`
- `student_assessments_join`

### Endpoints

Assess makes use of the following 42 endpoints. We may refactor or combine some of these in future.

- /v2/assessment (8)
  - GET
    - index
    - teacher
    - student
    - template
  - POST
    - index
    - share
  - PUT
    - index
  - DELETE
    - index
- /v2/classes (4)
  - GET
    - index
  - POST
    - index
  - PUT
    - index
  - DELETE
    - index
- /v2/curriculum (2)
  - GET
    - index
    - filters
- /v2/media (2)
  - POST
    - upload
  - DELETE
    - index
- /v2/notification (3)
  - GET
    - index
  - PUT
    - index
  - DELETE
    - index
- /v2/question (1)
  - POST
    - answer
- /v2/results (8)
  - GET
    - index
    - assessment
    - curriculum
    - orphaned
  - POST
    - index
    - blank
  - PUT
    - index
  - DELETE
    - index
- /v2/teacher (5)
  - GET
    - find
    - info
    - logout
    - status
  - POST
    - login
- /v2/user (1)
  - PUT
    - prefs
- /v1/search (2)
  - GET
    - resource
    - topic
- /v2/student (8)
  - GET
    - index
    - info
    - status
  - POST
    - index
    - login
  - PUT
    - index
    - prefs
  - DELETE
    - index

### User capabilities and roles

To access Assess, a user requires the capability: `access_product_assess`

We put limits on some roles with the following 2 capabilities:

- `assess_basic_plan` (basic, starter, teacher, essential plans)
- `assess_plus_plan` (plus/ultimate plans)
- no capability (free plan)

These limits are:

`free_assessment_limit = 3` `free_archive_limit = 1` `free_student_limit = 30` `free_class_limit = 2` `free_assign_limit = 5`

`basic_assessment_limit = 3` `basic_archive_limit = 50` `basic_student_limit = 30` `basic_class_limit = 2` `basic_assign_limit = 5`

`plus_assessment_limit = 99` `plus_student_limit = 30` `plus_class_limit = 2`

There is a limit of 2 classes per user but Plus users are able to request more. To increase their class limit, we can modify the `assess_classes` user meta field from their profile in the WordPress admin. This will override the default limit.

## Third-party plugins

This project makes use of several JS plugins. These are

- [Axios](https://github.com/axios/axios): AJAX requests to API. Used in `/src/store/actions.js`
- [DayJS](https://github.com/iamkun/dayjs): date library. Lightweight alternative to Moment.js
- [NanoID](https://github.com/ai/nanoid): generate unique ID slugs for activity URLs
- [Vue Scroll Sync](https://github.com/metawin-m/vue-scroll-sync): syncronise horizontal scroll for results curriculum header
- [Vue Dragula](https://github.com/kristianmandrup/vue2-dragula): drag-and-drop library for activity editor and sort/match questions. Using my forked version which fixes a bug that the author refuses to fix
- [Vue Flatpickr](https://github.com/ankurk91/vue-flatpickr-component): calendar date selector. TODO: fix accessiblity issues with this
- [Vue JSON-to-CSV](https://github.com/angeliquekom/vue-json-to-csv): to download results in CSV format
- [Vue Router](https://router.vuejs.org/): official routing library for Vue. All routes load inside `<router-view>...</router-view>`
- [Vue Scroll Sync](https://github.com/metawin-m/vue-scroll-sync): scroll the curriculum table headers horizontally when table is scrolled
- [Vue ShortKey](https://github.com/iFgR/vue-shortkey): listen for keyboard shortcuts and trigger actions
- [Vue SmoothScroll](https://github.com/Teddy-Zhu/vue-smoothscroll): smooth scroll the viewport or a container
- [Vue Textarea Autosize](https://github.com/devstark-com/vue-textarea-autosize): auto-adjust the height of a textarea as the user types
- [Vue Tour](https://github.com/pulsardev/vue-tour/): walkthrough for first-time users (shown in user meta: 'assess_tour' is true)
- [VueX](https://vuex.vuejs.org/): official state management library for Vue. State configured in `/src/store/index.js`

## Styling

The bulk of the styles are found in the `/src/assess/scss` folder, with components each containing additional scoped styling. `/src/assets/scss/_variables.scss` is imported for use in all components in vue.config.js. This means you can use global variables like colour, font size, media queries anywhere. Most styles are loaded in Assess.vue, but this could be improved.

The app is configured to export a compressed CSS file for each component route. So the compiled project has about 20 CSS files which are loaded as needed. Serving multiple files concurrently is not an issue for HTTP/2 servers.

## Project setup

```
sudo npm install yarn -g // install yarn
yarn // install all dependencies
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Prettier

For code consistency, please install and use Prettier in your code editor. A .prettierrc.js file with standard formatting is included in the repo.

[Sublime Text](https://github.com/danreeves/sublime-prettier) [JetBrains](https://plugins.jetbrains.com/plugin/10456-prettier) [VS Code](https://github.com/prettier/prettier-vscode)

### SVG Loader

I've included [Vue SVG loader](https://vue-svg-loader.js.org/) as a dev dependency (vue-svg-loader and vue-template-compiler packages), but it's not currently being used. So can be removed fromt the config, if you like. Allows you to import SVG files as components eg. import Logo from 'logo.svg'; - but all the SVGs in Assess are inlined instead.
