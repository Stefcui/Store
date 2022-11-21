var Deploy = require('ftp-deploy');
var ftpDeploy = new Deploy();
 
var config = {
    host : "ftp.rocherobots.store",
    user : "rochero1",
    password : "01BLUEhen!!!",
    port: 21,
    localRoot: __dirname + '/build',
    remoteRoot: '/public_html/',
    include: ['*'],
    deleteRemote: true 
}
ftpDeploy.deploy(config, function(err, res) {
    if (err) console.log(err)
    else console.log('finished:', res);
});
ftpDeploy.on("uploading", function(data) {
    data.totalFilesCount; 
    data.transferredFileCount;
    data.filename; 
});
ftpDeploy.on("uploaded", function(data) {
    console.log(data); 
});
ftpDeploy.on("log", function(data) {
    console.log(data);
});
ftpDeploy.on("upload-error", function(data) {
    console.log(data.err);
});
