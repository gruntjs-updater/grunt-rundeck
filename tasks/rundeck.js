module.exports = function(grunt){
    var request = require('request');
    var async = require('async');
    var xml2js = require('xml2js').parseString;

    var buildJobUrl = function(server, job, params){
      return server + '/api/12/job/' + job + '/run?argString=' + buildArgString(params);
    };

    var buildPollUrl = function(server, executionId){
      return server + '/api/12/execution/' + executionId;
    };

    var buildArgString = function(params){
      var s = "";
      Object.keys(params).forEach(function(k){
        s += "-" + k + " " + params[k] + " ";
      });

      return s;
    };

    var get = function(url, options, done){
      grunt.verbose.writeln(url);
      var res = request({
          url: url,
          headers: {
              'user-agent': 'grunt-rundeck',
              'X-Rundeck-Auth-Token': options.token
          }
      }, function(err, res, body){

          if(err){
              return done(err);
          }

          var statusCode = res && res.statusCode;

          if(statusCode !== 200){
              return done(new Error('status code was: ' + res.statusCode + ' => ' + body));
          }

          if(!body){
            return done(new Error("got an empty response from rundeck api"));
          }

          xml2js(body, function(err, response){
            done(null, response);
          });

      });
    };

    var runJob = function(options, done){
        var url = buildJobUrl(options.rundeck, options.job, options.params);
        get(url, options, function(err, body){
          if(err){
            return done(err);
          }

          var executionInfo = body.executions.execution[0];
          grunt.log.ok("Execution created: " + executionInfo.$.href);
          return done(null, executionInfo);
        });
    };

    var pollResults = function(executionId, options, done){
        var url = buildPollUrl(options.rundeck, executionId);

        get(url, options, function(err, body){
          if(err){
            return done(err);
          }

          var executionInfo = body.executions.execution[0];

          if(executionInfo.$.status === "failed"){
            return done(new Error("rundeck execution failed: " + JSON.stringify(executionInfo)));
          }

          grunt.verbose.writeln("status: " + executionInfo.$.status);
          return done(null, executionInfo);
        });
    };

    grunt.registerMultiTask('rundeck', function(){
        var done = this.async();
        var options = this.options({
            rundeck: '127.0.0.1',
            apiVersion: 12,
            pollInterval: 2000,
            params: {}
        });

        grunt.verbose.writeflags(options);

        runJob(options, function(err, execution){

          if(err){
            return grunt.fail.fatal(err);
          }

          var status = execution.$.status;
          var executionId = execution.$.id;

          async.until(function(){
            return status === "succeeded";
          },
          function(next){
            pollResults(executionId, options, function(err, response){
              if(err){
                return grunt.fail.fatal(err);
              }

              status = response.$.status;
              setTimeout(next, options.pollInterval);
            });
          },
          function(err){
            if(err){
              grunt.fail.fatal(err);
            }

            done();
          });
        });
    });
};
