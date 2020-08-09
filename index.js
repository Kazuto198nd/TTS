var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views","./views");
app.use(express.static("public"));
app.listen(process.env.POST || 3000);

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nvthi:g6C7B7BR5MkN7Rc3@cluster0.b7x63.mongodb.net/Student?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if(err){
        console.log("Mongo connect error : " + err);
    }else{
        console.log("Mongo connected seccessful.")
    }
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var Student = require("./Models/student");

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
});  

var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/png" || file.mimetype=="image/gif" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("studentImage");

app.get("/", function(req ,res){
    Student.find(function(err,data){
        if(err){
            res.json({"kq": 0,"errMsg": err});
        }else{
            res.render("list",{danhsach:data});
        }
    });
});

app.get("/add", function(req, res){
    res.render("add");

});

app.post("/add", function(req, res){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({"kq":0, "errMsg" : "A Multer error occurred when uploading."});
        } else if (err) {
            res.json({"kq":0, "errMsg" : "An unknown error occurred when uploading." + err});
        }else{
            var student = Student({
                Name : req.body.txtName,
                Image : req.file.filename,
                Class : req.body.txtClass,
                MSV   :req.body.txtMSV,
                Age : req.body.txtAge
            });
            student.save(function(err){
                if(err){
                    res.json({"kq":0, "errMsg" : err});
                }else{
                    res.redirect("./list");
                }
            });
        }

    });
});

app.get("/list", function(req, res){
    Student.find(function(err,data){
        if(err){
            res.json({"kq": 0,"errMsg": err});
        }else{
            res.render("list",{danhsach:data});
        }
    });
});

app.get("/edit/:id" , function(req, res){
    Student.findById(req.params.id, function(err, char){
        if(err){
            res.json({"kq": 0,"errMsg": err});
        }else{
            console.log(char);
            res.render("edit",{nhanvat:char});
        }
    }); 
});

app.post("/edit", function(req, res){
    upload(req, res, function (err) {
        if(!req.file){
            Student.updateOne({_id: req.body.IDchar}, {
                Name: req.body.txtName,
                Class:req.body.txtClass,
                MSV:req.body.txtMSV,
                Age: req.body.txtAge
            }, function(err){
                if(err){
                    res.json({"kq":0, "errMsg" : err});
                }else{
                    res.redirect("./list");
                }
            });
        }
        else{
            if (err instanceof multer.MulterError) {
                res.json({"kq":0, "errMsg" : "A Multer error occurred when uploading."});
            } else if (err) {
            res.json({"kq":0, "errMsg" : "An unknown error occurred when uploading." + err});
            }else{
                Student.updateOne({_id: req.body.IDchar}, {
                    Name: req.body.txtName,
                    Image: req.file.filename,
                    Class:req.body.txtClass,
                    Age: req.body.txtAge
                }, function(err){
                    if(err){
                        res.json({"kq":0, "errMsg" : err});
                    }else{
                        res.redirect("./list");
                    }
                });
            }
        }
    });
});

app.get("/delete/:id", function(req, res){
    Student.deleteOne({_id:req.params.id}, function(err){
        if(err){
            res.json({"kq":0, "errMsg" : err});
        }else{
            res.redirect("../list");
        }
    });
});