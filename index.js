const express = require('express');
var multer = require('multer')
var path = require("path");  
// var url = require("url");
var fs = require("fs");
var config = require("./config");

// var storage = require('filestorage').create(config.stg_path);
// var upload = multer({ dest: config.stg_path })
const app = express();

  
// 递归创建目录 异步方法  
function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            // console.log(path.dirname(dirname));  
            mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
}  
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

var storage = multer.diskStorage(
    { 
        destination: function (req, file, cb) { 
            console.log(file); 
            var rel_path = file.originalname.replace(/_/g,'/')
            console.log( rel_path)
            var full_path = config.stg_path + '/' + rel_path
            // ext=ext[ext.length-1]; 
            mkdirsSync( path.dirname(full_path)  )
            cb(null, path.dirname(full_path)) 
        }, 
        filename: function (req, file, cb) { 
            var rel_path = file.originalname.replace(/_/g,'/')
            
            // var ext=ext.split('.'); 
            // ext=ext[ext.length-1]; 
            cb(null, path.basename(rel_path) ) 
        }
    
    } ); 
var upload = multer({ storage: storage }).single('image'); 

app.post('/upload', 
    function (req, res) { 
        upload(req, res, function (err) {
            if( err instanceof multer.MulterError )
            {
                res.sendStatus(500 );
            }
            else
            res.send("Your uploaded file name : " + req.file.originalname );
        })    
    })
app.get('/imgs/*', 
    (req,res) => {
        //console.log( req.params.path )
        let p = req.url.substr(5)
        res.sendFile( path.join( config.stg_path, p ));
    })

app.get('/l/*',
    (req,res) => {
        let rp = req.url.substr(2)
        let p = path.join( config.stg_path, rp )
        // console.log( p )
        if( !fs.existsSync( p )) {
            res.sendStatus(404)
            return
        }
        var files = fs.readdirSync(p)
        var content = "<html><body><ul>"
        console.log( rp )
        if( rp != '/' && rp.length > 0 ) {
            content += "<li><a href='../'>..</a></li>"
        }
        // console.log( files )
        files.forEach( filename => {
            var stats = fs.statSync(path.join(p,filename))
            // console.log( stats.isDirectory(),stats.isFile()  )
            if( filename.startsWith('.'))
                return;
            if(stats.isFile()){
                content = content + `<li><a href='/imgs/${rp}/${filename}'>${filename}</a></li>`
            }else if(stats.isDirectory()){
                content = content + `<li><a href='./${filename}/'>${filename}</a></li>`
            }
        })
        content += "</ul></body></html>"
        // console.log( content )
        res.send(content)
    })
app.listen(config.port, function() {
    console.log('Express server listening on port ', config.port); // eslint-disable-line
  });