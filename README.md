TPP - The Team Project Planner
===

@TODO add project description


### Project Setup
    $ git clone git@github.com:Mayflower/tpp.git && cd tpp && npm install

### Running the app during development

* Install [simple-server](https://github.com/balupton/simple-server)
* run `$ simple-server .` in your project directory
* Open the displayed url in your browser


## Running unit tests:
### Unit testing

* Start `$ node_modules/.bin/grunt test:unit-dev`
* a browser will start and connect to the Karma server (PhantomJS is default browser, others can be captured by loading the same url or by changing the `Gruntfile.js` file)
* to run or re-run tests just change any of your source or test javascript files

### End to end testing

Angular ships with a baked-in end-to-end test runner that understands angular, your app and allows you to write your tests with jasmine-like BDD syntax.
Check out the [end-to-end runner's documentation](http://docs.angularjs.org/guide/dev_guide.e2e-testing) for more info.

* Start `$ node_modules/.bin/grunt test:e2e-dev`
* to run or re-run tests just change any of your source or test javascript files