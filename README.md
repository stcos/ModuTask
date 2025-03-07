# ModuTask

## Setup
- Install latest NodeJS from https://nodejs.org/en/download
- Install Git from https://git-scm.com/downloads
- Clone project 
- Open project in VSC
- Install Playwright plugin for debug execution
- Run npm install
- Run npx playwright install (Command will download browsers)


## Test Execution
The tests will run on 3 different browsers in parallel. Chrome, Edge and Firefox
- Run npm test
NOTES: The tests will retry once if the test fails

## Reporting
If the tests fail, the result is save in ./playwright-report and the HTML Report will be opened in the browser.
The screenshots are saved in ./test-results for failed tests

## Tests
### Filter spec
Filters current hotel results
### Overview spec
Tests overview page of Hotel
### Performance spec
Test navigation to service performance by using fixture performance-fixture.ts
### Seach spec
Verifies search with different search options