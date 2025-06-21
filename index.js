const express =require('express');
const path = require('path');
const app=express();
const fs=require('fs');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    fs.readdir(`./files`,function(err,files){
        res.render("index",{files:files});
    })
});

app.get('/file/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('show' ,{
            filename:req.params.filename,
            filedata:filedata

        })
    });
});




app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('edit',{filename:req.params.filename});
    });
});

app.post('/edit', (req, res) => {
    let { previous, newTitle } = req.body;

    if (!previous || !newTitle) {
        return res.status(400).send("Both previous and newTitle are required");
    }

    // Optional: enforce `.txt` extension
    if (!newTitle.endsWith('.txt')) {
        newTitle += '.txt';
    }

    fs.rename(`./files/${previous}`, `./files/${newTitle}`, (err) => {
        if (err) {
            console.error("Rename error:", err);
            return res.status(500).send("Error renaming file");
        }
        res.redirect("/");
    });
});



app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
  res.redirect("/")
    });
});



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

