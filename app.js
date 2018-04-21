const express = require('express');
const app = express();
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
const path = require('path');

app.engine("hbs", handlebars({
  defaultLayout: "main",
  extname: '.hbs',
  // helpers: {
  //   ago: function(date) {
  //     return moment(date).fromNow();
  //   }
  // }
}));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

console.log(aws);
const s3 = new aws.S3();
console.log(s3);
const storage = multerS3({
  contentType: multerS3.AUTO_CONTENT_TYPE,
  s3: s3,
  bucket: 'paul-delancy-bucket',
  key: function(req, file, cb) {
    cb(null, "photos/" + Date.now().toString());
  },
})

const upload = multer({
  storage: storage,
});

const { Photo } = require("./models");

app.get('/', (req, res) => {
  // var params = {
  //   Bucket: 'paul-delancy-bucket',
  //   Prefix: 'photos/',
  //   MaxKeys: 1000,
  // };
  //
  // s3.listObjects(params, function(err, data) {
  //   if (err) {
  //     // An error occured.
  //   } else {
  //     console.log(data);
  //     // Iterate over the returned objects.
  //     // data.Contents.map((photo) => console.log(photo));
  //     res.render('index', {
  //       photos: data.Contents
  //     });
  //   }
  // });
  Photo.find((err, photos) => {
    console.log(photos);
    res.render('index', {
          photos
        });
  })
})

app.post('/photo', upload.single('photo'), function(req, res) {
  console.log(req.file);
  let photo = new Photo({
    location: req.file.location
  })
  photo.save((err, photo) => {
    console.log(photo);
    res.redirect('/');
  })
});

var port = parseInt(process.env.PORT, 10) || 3000;
app.set("port", port);

app.listen(port, function(err){
  console.log("Server listening on port " + port);
})
