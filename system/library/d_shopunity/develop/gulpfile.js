var gulp = require('gulp');
var browserSync = require("browser-sync");
var path = require("path");
var fs = require("fs");

if (typeof process.env.HOST === "undefined") {
    process.env.HOST = 'localhost';
}
var base_dir = path.resolve(__dirname, "../../../../");
var shopunity_dir = base_dir + '/system/library/d_shopunity/';
if (typeof process.env.extension === "undefined") {
    process.env.extension = 'd_shopunity';
}

gulp.task('change', function(e, data) {
    console.log(e);
    console.log(data);
});
gulp.task('default', function() {
    // получить git
    var extension = process.env.extension;
    var extension_path = shopunity_dir + 'extension/' + extension + '.json';
    fs.readFile(extension_path, function(err, data) {
        if (!err) {
            var parsedData = JSON.parse(data);
            var dependencies = typeof parsedData.required == "object" ? parsedData.required : {};

            Object.keys(dependencies).forEach(function(codename) {
                var version = dependencies[codename];
                //get files of codename extension
                fs.readFile(shopunity_dir + 'extension/' + codename + '.json', function(err, codenameData) {
                    if (!err) {
                        //find git folder next to root folder
                        var codename_dir = path.resolve(base_dir, "../") + '/' + codename;
                        if (fs.existsSync(codename_dir + '/.git')) {
                            var parsedCodenameData = JSON.parse(codenameData);
                            var files = typeof parsedCodenameData.files == "object" ? parsedCodenameData.files : [];
                            var dirs = typeof parsedCodenameData.dirs == "object" ? parsedCodenameData.dirs : [];
                            //get files from dir
                            addDirs(dirs, files, function(err, files) {
                                files = files.map(function(file) {
                                    return base_dir + '/' + file;
                                });
                                console.log(files);

                                gulp.watch(files, function(data) {
                                    if (data.type === 'changed') {
                                        console.log('file changed: ' + data.path);
                                        console.log(data.path.replace(base_dir, codename_dir))
                                        fs.copyFileSync(data.path, data.path.replace(base_dir, codename_dir), function(err, data) {
                                            console.log(err)
                                            console.log(data)
                                        });
                                        //copy changes to the git folder
                                    } else if (data.type === 'deleted') {
                                        console.log('file deleted: ' + data.path);
                                        //delete file on the git folder
                                    } else {
                                        console.log(data);
                                    }
                                });
                            })


                        } else {
                            console.log(codename_dir + ' does not exist');
                        }
                    } else {
                        console.log(err);
                    }


                });
                //find repo of codename next to this root folder
                codename;


            });

        } else {
            console.log(err);
        }

    });
});

function addDirs(dirs, files, callback) {
    if (dirs) {
        Object.keys(dirs).forEach(function(key) {
            var dir = dirs[key];
            if (fs.existsSync(base_dir + '/' + dir)) {
                console.log('Dir parsed: ' + base_dir + '/' + dir);
                fs.readdir(base_dir + '/' + dir, function(err, fileData) {
                    if (!err) {
                        fileData.forEach(function(file) {
                            console.log('File added: ' + dir + '/' + file);
                            if (fs.lstatSync(base_dir + '/' + dir + '/' + file).isDirectory() && file != 'node_modules') {
                                addDirs([dir + '/' + file], files, function(err, files) {});
                            }
                            files.push(dir + '/' + file);
                        });
                        callback(false, files);
                    } else {
                        console.log('Error! ' + file);
                        callback(true, files);
                    }

                });
            } else {
                console.log('Dir not found: ' + base_dir + '/' + dir);
                callback(true, files);
            }
        });
    } else {
        callback(true, files);
    }
}