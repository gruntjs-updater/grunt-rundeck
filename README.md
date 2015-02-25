# grunt-rundeck
[![Build Status](https://travis-ci.org/opentable/grunt-rundeck.png?branch=master)](https://travis-ci.org/opentable/grunt-rundeck) [![NPM version](https://badge.fury.io/js/grunt-rundeck.png)](http://badge.fury.io/js/grunt-rundeck) ![Dependencies](https://david-dm.org/opentable/grunt-rundeck.png)

Trigger a rundeck job from grunt and keep checking it until it's finished.

installation:

```npm install --save-dev grunt-rundeck```

usage:

```
grunt.initConfig({
  'rundeck': {
    options: {
      rundeck: 'https://my.rundeck.server.com:4443', // base url where rundeck lives
      apiVersion: 12,
      token: 'E4rNvVRV378knO9dp3d73O0cs1kd0kCd'
    },
    'deploy': {
        options: {
            job: '568e6020-17f5-4b67-9add-0901f40f806f', // job id
            params: {
              foo: 'bar' // options which get passed to the job
            }
        }
    }
  }
});

```
