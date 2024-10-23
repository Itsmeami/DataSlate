const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir(`./files`, function(err, files) {
        if (err) {
            console.log(err);
            res.status(500).send("Error reading files");
        } else {
            res.render("index", { files: files });
        }
    });
});

app.get('/file/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.log(err);
            res.status(500).send("Error reading file");
        } else {
            res.render('show', { filename: req.params.filename, filedata: filedata });
        }
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/edit', function(req, res) {
    console.log(req.body);  // Log to check what's being sent
    if (req.body.previous && req.body.new) {
        fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err) {
            if (err) {
                console.log(err);
                res.status(500).send("Error renaming file");
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.status(400).send("Invalid title");
    }
});

app.post('/create', function(req, res) {
    // Log the request body for debugging
    console.log(req.body);
    
    if (req.body.title && typeof req.body.title === 'string') {
        const sanitizedTitle = req.body.title.split(' ').join('');
        fs.writeFile(`./files/${sanitizedTitle}.txt`, req.body.details, function(err) {
            if (err) {
                console.log(err);
                res.status(500).send("Error creating file");
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.status(400).send("Invalid title");
    }
});

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
