var http = require("http"),
    fs = require("fs"),
    count = 0,
    running = "<executions count='1'><execution id='2924' href='http://127.0.0.1:8888/execution/follow/2924' status='running' project='MyProject'><user>blarg</user><date-started unixtime='1424878994979'>2015-02-25T15:43:14Z</date-started><job id='succeed' averageDuration='39647'><name>Succeed</name><group></group><project>MyProject</project><description>glargle</description><options><option name='foo' value='bar' /></options></job><description>fakey fake fake fake</description><argstring>-foo bar</argstring></execution></executions>",
    success = "<executions count='1'><execution id='2924' href='http://127.0.0.1:8888/execution/follow/2924' status='succeeded' project='MyProject'><user>blarg</user><date-started unixtime='1424878994979'>2015-02-25T15:43:14Z</date-started><job id='succeed' averageDuration='39647'><name>Succeed</name><group></group><project>MyProject</project><description>glargle</description><options><option name='foo' value='bar' /></options></job><description>fakey fake fake fake</description><argstring>-foo bar</argstring></execution></executions>";

var server = http.createServer(function(request, response) {

    if(request.url === '/kill'){
        response.end();
        process.exit(0);
    }

    var result = running;

    if(count > 4){
      result = success;
      count = 0;
    }

    response.writeHead(200, {"Content-Type": "application/xml"});
    response.write(result);
    response.end();

    count++;
}).listen(8888);
