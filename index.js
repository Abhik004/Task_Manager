const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
const { fileLoader } = require('ejs');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',function(req,res){
    fs.readdir('./files',function(err,files){
        res.render("index",{files:files}); //jab readdir ho jae tabhi render krna
    });
});

app.get('/edit/:filename',function(req,res){
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        res.render('edit', { filename: req.params.filename, filedata: filedata });
    });
});

app.post('/edit/:filename', function (req, res) {
    const oldFilePath = path.join(__dirname, 'files', req.body.previous);
    const newFilePath = path.join(__dirname, 'files', req.body.new || req.body.previous);
    const newFileData = req.body.curr;

    if (req.body.previous !== req.body.new && req.body.new) {
        fs.rename(oldFilePath, newFilePath, function () {
            fs.writeFile(newFilePath, newFileData, function () {
                res.redirect('/');
            });
        });
    } else {
        fs.writeFile(oldFilePath, newFileData, function () {
            res.redirect('/');
        });
    }
});
app.get('/file/:filename', function (req, res) {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split('').join('')}.txt`,req.body.details,function(err){
        res.redirect("/");
    })
})

app.post('/delete/:filename', function (req, res) {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.unlink(filePath, function () {
        res.redirect('/');
    });
});

app.listen(3000);