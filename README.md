# Sprout [![CircleCI](https://dl.circleci.com/status-badge/img/gh/PlentyAg/Sprout/tree/master.svg?style=svg&circle-token=f9b9f1c4310d3ae4acf26e2ed014d13c4a9d6eb8)](https://dl.circleci.com/status-badge/redirect/gh/PlentyAg/Sprout/tree/master) [![Coverage](https://sonar.plenty.tools/api/project_badges/measure?project=Sprout&metric=coverage&token=55aa5dcbca4ec66b745068d2cf4ef9a87d607504)](https://sonar.plenty.tools/dashboard?id=Sprout)

Sprout is a web application that provides the framework to build user interfaces to manage operations of various Plenty farms. It is a successor to Hypocotyl. It currently runs at [farmos.plenty.tools](https://farmos.plenty.tools).

## Overview Docs

- [Sprout overview slides](https://docs.google.com/presentation/d/1aprynnPHT3DdaL9x8DhMZup8olB9NLV3PGGzocJByzA/edit#slide=id.ga2bf0e4ff8_0_100)
- [Sprout overview video](https://plentyag.atlassian.net/wiki/spaces/EN/pages/1564279072/SD+Lunch+and+Learns+Front-End+Overview)
- [FarmOS Apps Overview](https://plentyag.atlassian.net/wiki/spaces/EN/pages/1819082820/SD+Lunch+and+Learns+Apps+Overview)

## Development Setup

<details>
<summary>Read about requirements, setup instructions, and running in local</summary>

### Requirements

- `pipenv` - can be installed using pip `pip install pipenv`
- `yarn` - can be installed using homebrew `brew install yarn`
- `node` - version 16.13.2 (or higher)

Run the following commands to bootstrap your environment:

    git clone git@github.com:PlentyAg/Sprout.git
    cd Sprout
    pipenv install --dev  # installs flask/python deps
    pipenv shell # To enter your virtual env
    cp .env.example .env  # fill out
    cd frontend && yarn  # installs front-end deps

When running local dev environment, the account associated with the PLENTY_API_KEY and PLENTY_API_SECRET in the .env file must have permissions to connect to various backend services used by Sprout. As such the associated user account needs proper permissions. To get the proper permissions, add the following roles: "developer-role", "hyp-developer-role", "hyp-plenty-role" and "sprout-role". Roles can be added using the plenty utility command line: https://github.com/PlentyAg/plenty-utils-python#using-the-cli. ex: pcli -e dev u r a {user_name} {role_name}

Now you should be setup to run both react and the Flask server. The server is setup to run on port 8000 and the react server will run on port 3000

### Running in CLI

To run both the React server and Flask server together:

```
    cd frontend
    yarn
    cd client
    yarn run dev
```

To run the server standalone, in the root directory run:

```
    pipenv run flask run
```

### IDE Setup

VSCode is the recommended IDE for front-end development.

> Install VSCode extensions:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) (includes black linter)

## Running and Debugging in VSCode

Launch configurations for VSCode are included in this repo for easy server debugging
and frontend launching. The configuration is found in the `launch.json` file. To run
Both server and frontend do the following:

### Debugging server

1. Open your VSCode IDE on the root folder
2. Make sure you're running the correct Python environment by doing the following:
   a. Go to the "Python" tab on the left
   b. Under "PipEnv" find "Sprout-\*" and set it as active environment (click on the thumbs up icon hovering over the selection)
3. Go to the "Run and Debug" tab on the left
4. Choose "BFF: Python Flask" and click on the "play" button
5. The bottom status bar should turn "brown" when it's ready

### Running client

1. With VSCode actively open, go to the "Run and Debug" tab on the left
2. Choose "FE: JS CRA" and click on the "play" button
3. It should open a terminal instance and run "yarn start"

## Running Hypocotyl and Sprout Together

- If the env var `WORKSPACE` is the path to Plenty repos in your local, then:
  - Start Hypocotyl using: `cd ${WORKSPACE}/Hypocotyl && yarn dev`
  - Start Sprout using: `cd ${WORKSPACE}/Sprout/frontend/client && WITH_HYPOCOTYL=True yarn dev"`
- Combined command with `concurrently` installed (`npm install -g concurrently`):
  `concurrently "cd ${WORKSPACE}/Hypocotyl && yarn dev" "cd ${WORKSPACE}/Sprout/frontend/client && WITH_HYPOCOTYL=True yarn dev"`

## Docker

### Build the docker image

```
docker build --env-file .env --ssh default . -f Dockerfile -t sprout
```

> note: `docker-compose build` does not support mouting the `.ssh` folder. Therefore we cannot build the docker images that depends on private repositories. In order to build, we need to use `docker` directly.

### Start the containers with docker-compose

Curently, the docker-compose command spins up a container for the flask server, the webpack server and redis.

```
docker-compose up -d
```

## Shell

To open the interactive shell, run ::

    flask shell

By default, you will have access to the flask `app`.

## Running Tests/Linter

To run all Flask/Python unit tests:

    pipenv run flask test

> note: to run a subset of tests: pipenv run flask test --filter TestUpdateUser (will only run tests in class TestGetUsers)

To run linter for Flask/Python:

    pipenv run flask lint

The `lint` command will attempt to fix any linting/style errors in the code. If you only want to know if the code will pass CI and do not wish for the linter to make changes, add the `--check` argument.

> note: to run lint for individual test: `pipenv run black [file path]`

To run all front-end unit tests:

    cd frontend && yarn test

Note: individual packages can be tested by running "yarn test" within the package.

To run linter for front-end:

    cd frontend && yarn lint

See: frontend/package.json for other linting commands that can be performed.

To run prettier for front-end:

    cd frontend && yarn lint:prettier:check

> note: To run integration tests locally see repo: https://github.com/PlentyAg/farmos_test_automation

</details>

## Deployment

To deploy the application, make a PR against the master (production) or staging branch.
Once approved, the branch will automatically deploy to the appropriate environment through circle ci.

---

## Project Details

<details>
<summary>Read more about the Front-end and the Back-end</summary>

### Conventions

For more about front-end Sprout conventions, see: https://plentyag.atlassian.net/wiki/spaces/EN/pages/1405190373/Frontend+Sprout+conventions

### Front-end: Jinja Templates

Pages like Home (`/home`), Login (`/login`), and API Docs (`/api-docs`) are rendered using Jinja Templates.

#### Important Files and Folders

```
└── server / sprout
    │
    └── templates
    │   # Folder containing templates that can be rendered,
    │   # base templates that can be extended,
    │   # and snippets that can be included.
    │
    └── app.py
        # The file used to instantiate the Flask app,
        # register blueprints for routing,
        # and register context processors for Jinja Templates.
```

#### How does it all work?

- When you go to `/` (i.e. `http://localhost:8000`) in your browser, `Flask` routes the request to the appropriate `blueprint` (registered in `app.py`), that matches the route. In this case, that would be the blueprint [`public`](server/sprout/public/views.py) and function `home` that renders the template [`public/home.html`](server/sprout/templates/public/home.html).
- Flask leverages [Jinja2](https://flask.palletsprojects.com/en/1.1.x/templating) as template engine. It provides dynamic rendering based on context variables. Variables included in the template context can be used in Jinja templates, and are especially useful for conditional rendering. It provides a set of [standard variables by default](https://flask.palletsprojects.com/en/1.1.x/templating/#standard-context), and also provides ways to pass additional context variables.
- In `app.py`, we also register [context processors](https://flask.palletsprojects.com/en/1.1.x/templating/#context-processors). Context processors run before the template is rendered and have the ability to inject new values into the template context.
- We also register various [extensions](). These extensions register their own context processors to inject values into the template context.
- Based on annotations like `@login_required` and `@permission_required`, Sprout validates if the user is logged in and has appropriate permissions before calling the function associated with the route.

### Front-end: React

Pages like `lab-testing`, `quality`, `perception` are rendered using React.

#### Important Files and Folders

```
└── frontend
    │
    └── brand-ui
    │   # Design System Components
    │
    └── client
    │   # Entry point for React apps,
    │   # and code for some apps and views.
    │   # This is folder you run the frontend from.
    │
    └── core
    │   # Core dependencies
    │
    └── {app}
    │   # Separate out code for a standalone app
    │
    └── package.json
        # Main package.json for workspaces
```

#### How does it all work?

- The React frontend is created using [`create-react-app`](https://create-react-app.dev/). It adds `react-scripts` as a dependency, which can be found in [`core/package.json`](frontend/core/package.json). We use `craco` to override some of the defaults provided by `create-react-app`, which can be found in [`client/package.json`](frontend/client/package.json).
- We use Typescript instead of Javascript in Sprout, which helps us write type safe code, provides nifty autosuggest features, and improves code quality in the long run.
- When you run `yarn dev` from `frontend/client`, and visit `http://localhost:3000` from the browser,
  - it starts the development server provided by `create-react-app`.
  - `create-react-app` looks for the entry point: [`./src/index.tsx`](frontend/client/src/index.tsx),
  - builds chunks of bundled JS files,
  - injects these files into [`./public/index.html`](frontend/client/public/index.html),
  - and serves the resulting file to the browser.
- In production, the Flask server is expected to serve the React app. During deployment, we run `yarn build`, which builds various chunks of the React app, and builds a new `index.html`. Post-build, we copy these files to `dist/static` (in the root folder of the project), which is accessible to the Flask app during production. Flask then serves `index.html` from this folder, when the route matches a blueprint route meant for serving the React app.
- Upon load, we first fetch initial state from the Flask server, which includes details like available sites and rooms, and permissions for current user.
- After this initial state is loaded from the server, we use `react-router` and React's `lazy` and `suspense` features to lazily load the code for the right app based on route matching.

### Back-end: Flask

#### Important Files and Folders

```
└── server
│   │
│   └── sprout
│   │   │
│   │   └── config
│   │   │   # folder containing settings and extensions
│   │   │
│   │   └── app.py
│   │       # The entry point for Flask app (and production server)
│   │
│   └── main.py
│       # The entry point for development server
│
└── .env
│   # File containing the environment variables
│
└── Pipfile
    # Python dependencies (Alternative to requirements.txt)
```

- We use `pipenv` and `Pipfile` for managing python virtual environment and dependencies in Sprout.
- When you use `pipenv` to run the `flask` app (using `pipenv run flask run`, which is called by `yarn dev`), it looks for a python entry point that exposes `app` based on the environment variable `FLASK_APP`. `pipenv` automatically loads environment variables from `.env`. Thus, in local, Flask starts by running [`server/main.py`](server/main.py). In production, we use [`gunicorn`](deploy/prod/supervisord_programs/gunicorn.conf) instead for better performance.
- In [`app.py`](server/sprout/app.py), we initialize the Flask app, and configure:
  - Static folder
  - Extensions
  - Blueprints (Namespaced routes)
  - Loggers, Request handlers, and Error handlers
  - Static assets builder for CSS and JS to be used in Jinja templates
- Views and API endpoints are grouped and namespaced using `blueprint`s. Each `blueprint` can specify its own `url_prefix`. Blueprints are typically created in `views.py` of various groups. For e.g. [`api/api_docs/views.py`](server/sprout/api/api_docs/views.py).
- As described above in the [Front-end: Jinja Templates](#front-end-jinja-templates) section, each route function can have annotations like `@login_required`, `@permission_required(RESOURCE, LEVEL)`, and `@cache.cached()`.
- We use [`CSRFProtect`](https://flask-wtf.readthedocs.io/en/stable/csrf.html) feature of `flask_wtf` to protect `POST`, `PUT`, `DELETE` requests from CSRF attacks. We also use `samesite='Lax'` for cookies for additional CSRF protection.

### Adding a new API from Using Plenty Util Python

- [Plenty Util Python](https://github.com/PlentyAg/plenty-utils-python)
- Update corresponding client file with the newly created API. List of clients [Clients](https://github.com/PlentyAg/plenty-utils-python/tree/master/plentyservice)
- After the review cycle. Release using `devopscli release minor -m '{commit message}'`
- Update the Sprout's pipfile with new version for `plentyservice`
- update permissions file in Sprout: https://github.com/PlentyAg/Sprout/blob/master/server/sprout/api/plentyservice/permissions.py
- New api from front-end code can be used as: /api/plentyservice/{service-name}/{api_name}

### Adding a new module

- A module typically consists of:
  - A set of routes
  - A Plenty Resource for checking permissions against
  - A `hyp-single-{resource-name}-{level}` role (all in small case and separated by hyphens), with permission on the resource. This will be pulled into the 'Admin' page as an option to manage user permissions.
  - A home icon linking to the home page of the module
  - A navbar link to the home page of the module
- Start by setting up Flask routes and React front-end if needed. Ensure that on requesting the base url of the module, Flask serves the home page. For a React app, the base path of a React app should be the same as the route for the home page served by Flask, and Flask should serve the React app's `index.html`. Also add this base url to `SPROUT_ROUTES` in [`setupProxy.js`](frontend/client/src/setupProxy.js).
- Add the home icon and navbar link to the module's home page in both Sprout and Hypocotyl.
  - In Sprout, you need to add it to [`modules.html`](server/sprout/templates/snippets/modules.html).
  - In Hypocotyl, you need to add it to [`home.html`](https://github.com/PlentyAg/Hypocotyl/blob/master/src/main/resources/templates/home.html), and [`navbar.html`](https://github.com/PlentyAg/Hypocotyl/blob/master/src/main/resources/templates/navbar.html).
- If the name of the Plenty Resource is `TEST_RESOURCE`
  - Make sure you add annotations for checking permissions for each route if applicable.
  - Add this Plenty Resource to `PlentyResource.java` of `plenty-utils-java`. Make a new patch release.
  - Bump the versions of `plenty-utils-java` in `UserStore` and `Hypocotyl`, and release them into deploy environment.
  - Create `hyp-single-{resource-name}-{level}` (in this example: `hy-single-test-resource-read`) role in UserStore.

### Deployment

- `gunicorn` is used to serve the Flask app, with `gevent` workers. This enables higher request throughput per worker.
- We use `supervisord` to manage `gunicorn` and background worker processes.
- When you go to `https://farmos.plenty.tools`, [`farmos-router`](https://github.com/PlentyAg/farmos-router/blob/master/nginx.conf) routes hard-coded `Hypocotyl` paths to `https://hypocotyl.plenty.tools` and everything else to `https://sprout.plenty.tools`.

### AWS S3 BUCKETS

Sprout has a dedicated s3 bucket per environment configured through a Vault env variable `PLENTY_SPROUT_S3_BUCKET`.

#### Naming convention

If the files stored in s3 are app specific, make sure you store these files under a namespace that corresponds to the app.

For example:

- SeedlingQA images are namespaced under `/quality/seedling-qa` since SeedlingQA is part of the Quality application.
- Utilitiles requires a file to sync nutrient dosing. Therefore the file is namespaced under `/utilities`.

##### Nginx notes

- In addtion to running the flask app, supervisord also runs a nginx proxy for some reason
- nginx proxies all requests to the flask app
- nginx modifies the http `Host` header to `NGINX_PROXY_HOST` env variable
- flask uses this header to build urls
- in prod, dev & staging this var should point to the farmos router - `farmos.plenty-dev.tools` - `farmos.plenty-staging.tools` - `farmos.plenty.tools`
- for the three additional dev sprouts this var should point to: - `sprout-a.plenty-dev.tools` - `sprout-b.plenty-dev.tools` - `sprout-c.plenty-dev.tools`

### Assets Pipeline

#### On the server:

```
└── server
    └── sprout
      └── assets
      └── static
```

- `assets`: Non static assets such as SCSS or un-minified/un-uglified JS files. These files will get bundled into the static folder.
- `static`: Static assets served by the Flask app. (css, js, images, ...) This also correspond to the [Flask static folder](https://flask.palletsprojects.com/en/1.1.x/tutorial/static/). In production this will contain the assets built by the React app.

#### On the frontend:

```
└── frontend
    └── client # entrypoint of the React application
      └── src
      │  └── setupProxy.js # Configure this file to load Flask assets from the React app.
      └── build
```

- In development, Webpack bundles and serves the React app.
- In production, we build the client and move the build to the **Flask static folder** in order to be served by the Flask app. (see the scripts:`build`and`postbuild` in [package.json](frontend/client/package.json).

### What is missing right now?

- Utilities for checking permissions on the front-end
- Translation engine

</details>

## CI Deployment

The full documentation about how CI works is presented in [Confluence](https://plentyag.atlassian.net/wiki/spaces/EN/pages/1075315040/CI+CD+Workflow+Improvements).

## Hotfix Deployment

To initiate a hotfix deployment:

- Push a branch with a `hotfix-` prefix
- Open a PR
- Get the PR approved by code owner
- press the purple button in CCI 🚀🚀

For more information see this [doc](https://plentyag.atlassian.net/wiki/spaces/EN/pages/1075315040/CI+CD+Workflow+Improvements#HotFixes).

## License / Attributions

- data-docs.svg icon Icons made by Nhor Phai https://www.flaticon.com/authors/nhor-phai, under Creative Commons License.
