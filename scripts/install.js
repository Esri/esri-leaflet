var sys = require('sys');
var exec = require('child_process').exec;
 

process.chdir('./node_modules/leaflet');
exec('npm install', function (error, stdout, stderr) {
  if (error)  { sys.puts(error);return; }
  if (stderr) { sys.puts(stderr);return; }
  if (stdout) { sys.puts(stdout); }
  exec('jake', function (error, stdout, stderr) {
    if (error)  { sys.puts(error); }
    if (stderr) { sys.puts(stderr); }
    if (stdout) { sys.puts(stdout); }
  });
});
