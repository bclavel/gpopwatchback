var express = require('express');
var router = express.Router();
var directorModel = require('../models/director');
var userModel = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to G-Pop Watch BackEnd' });
});

const getId = function(opt){
  return new Promise(function(resolve, reject){
  var https = require('https');

  var options = {
    'method': 'POST',
    'hostname': 'scalr.api.appbase.io',
    'path': '/gpop-data2/_doc',
    'headers': {
      'Authorization': 'Basic TVJ3UjB1MDZDOmMwOTAzZDQ4LTdiYWQtNGE4Zi1hZTdmLWM1YzFlMGI4YmI5YQ==',
      'Content-Type': 'application/json'
    }
  };

  var request = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log('Body', body.toString());
      return resolve(body.toString())
    });

    res.on("error", function (error) {
      console.error(error);
      return reject(error)
    });
  });

  var subCatList = opt.directorSubCat.split(', ')
  var profileList = opt.directorProfile.split(',')

  var appBaseBody = {
    name: opt.directorName,
    localisation: opt.directorLoca,
    category: opt.directorCat,
    subcategories: subCatList,
    profiles: profileList,
    situation: opt.directorSituation,
    content: opt.directorContent,
    email: opt.directorContactEmail,
    phone: opt.directorContactPhone,
    contact: opt.directorContacted,
    website: opt.directorWebsite,
    vimeo: opt.directorVimeo,
    instagram: opt.directorInsta,
    video1: opt.directorVideo1,
    video2: opt.directorVideo2,
    video3: opt.directorVideo3,
    video4: opt.directorVideo4
  }

  var appBaseData = JSON.stringify(appBaseBody)

  request.write(appBaseData);

  request.end();

  })
}

router.post('/createdirector', function(req, res, next) {
  console.log('req.body', req.body);

  getId(req.body)
  .then(function (data){
  console.log("getId Promise data >>", data)

  var directorData = new directorModel({
    directorName: req.body.directorName,
    directorLoca: req.body.directorLoca,
    directorCat: req.body.directorCat,
    directorSituation: req.body.directorSituation,
    directorContent: req.body.directorContent,
    directorContactEmail: req.body.directorContactEmail,
    directorContactPhone: req.body.directorContactPhone,
    directorContacted: req.body.directorContacted,
    directorWebsite: req.body.directorWebsite,
    directorVimeo: req.body.directorVimeo,
    directorInsta: req.body.directorInsta,
    directorAppbaseId: JSON.parse(data)["_id"]
  })

  directorData.directorVideos.push({
    videoUrl: req.body.directorVideo1,
    videoSource: req.body.directorVideoSource1
  })
  directorData.directorVideos.push({
    videoUrl: req.body.directorVideo2,
    videoSource: req.body.directorVideoSource2
  })
  directorData.directorVideos.push({
    videoUrl: req.body.directorVideo3,
    videoSource: req.body.directorVideoSource3
  })
  directorData.directorVideos.push({
    videoUrl: req.body.directorVideo4,
    videoSource: req.body.directorVideoSource4
  })

  var subCatList = req.body.directorSubCat.split(', ')
  for (var i = 0; i < subCatList.length; i++) {
    directorData.directorSubCat.push({
      subCatLabel: subCatList[i]
    })
  }

  var profileList = req.body.directorProfile.split(',')
  for (var i = 0; i < profileList.length; i++) {
    directorData.directorProfile.push({
      profileLabel: profileList[i]
    })
  }

  console.log('directorData', directorData);

  directorData.save(
    function (error, director) {
      if (error) {
        console.log('CREATE DIRECTOR - error', error);
      }
      console.log('CREATE DIRECTOR - director save', director);
      res.status(200).json(director);
    });
  })
  .catch(function (err){
    console.log("err promise : ", err)
    return res.sendStatus((200))
  })
});


router.get('/getdirector', function(req,res,next){

  directorModel.findOne({directorName : req.query.directorName})
  .exec(function(err, director){
    if (director) {
      console.log('GET DIRECTOR - Director trouvé', director);
      res.json(director);
    } else {
      console.log('GET DIRECTOR - walou pas de director');
      res.json(err);
    }
  })

});

router.post('/updatedirector', function(req,res,next){

  directorModel.findOne({directorName : req.body.oldName})
  .exec(function(err, director){
    if (director) {
      console.log('Director trouvé', director);
      // mettre à jour en BDD + dans l'API
      console.log('req.body', req.body);

      director.directorName = req.body.directorName,
      director.directorLoca = req.body.directorLoca,
      director.directorCat = req.body.directorCat,
      director.directorSituation = req.body.directorSituation,
      director.directorContent = req.body.directorContent,
      director.directorContactEmail = req.body.directorContactEmail,
      director.directorContactPhone = req.body.directorContactPhone,
      director.directorContacted = req.body.directorContacted,
      director.directorWebsite = req.body.directorWebsite,
      director.directorVimeo = req.body.directorVimeo,
      director.directorInsta = req.body.directorInsta,

      director.directorVideos[0] = {
        videoUrl : req.body.directorVideo1,
        videoSource : req.body.directorVideoSource1
      }
      director.directorVideos[1] = {
        videoUrl : req.body.directorVideo2,
        videoSource : req.body.directorVideoSource2
      }
      director.directorVideos[2] = {
        videoUrl : req.body.directorVideo3,
        videoSource : req.body.directorVideoSource3
      }
      director.directorVideos[3] = {
        videoUrl : req.body.directorVideo4,
        videoSource : req.body.directorVideoSource4
      }

      director.directorSubCat = []
      var subCatList = req.body.directorSubCat.split(', ')
      for (var i = 0; i < subCatList.length; i++) {
        director.directorSubCat.push({
          subCatLabel : subCatList[i]
        })
      }

      director.directorProfile = []
      var profileList = req.body.directorProfile.split(',')
      for (var i = 0; i < profileList.length; i++) {
        director.directorProfile.push({
          profileLabel : profileList[i]
        })
      }

      var https = require('https');

      var optionsUpdate = {
        'method': 'PUT',
        'hostname': 'scalr.api.appbase.io',
        'path': `/gpop-data2/_doc/${director.directorAppbaseId}`,
        'headers': {
          'Authorization': 'Basic TVJ3UjB1MDZDOmMwOTAzZDQ4LTdiYWQtNGE4Zi1hZTdmLWM1YzFlMGI4YmI5YQ==',
          'Content-Type': 'application/json'
        }
      };

      console.log('optionsUpdate', optionsUpdate);

      var updateReq = https.request(optionsUpdate, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log('Body', body.toString());
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      var appBaseBody = {
        name : req.body.directorName,
        localisation : req.body.directorLoca,
        category : req.body.directorCat,
        subcategories : subCatList,
        profiles: profileList,
        situation : req.body.directorSituation,
        content : req.body.directorContent,
        email : req.body.directorContactEmail,
        phone : req.body.directorContactPhone,
        contact : req.body.directorContacted,
        website : req.body.directorWebsite,
        vimeo : req.body.directorVimeo,
        instagram : req.body.directorInsta,
        video1 : req.body.directorVideo1,
        video2 : req.body.directorVideo2,
        video3 : req.body.directorVideo3,
        video4 : req.body.directorVideo4
      }

      var appBaseData = JSON.stringify(appBaseBody)

      updateReq.write(appBaseData);

      updateReq.end();

      director.save(
        function (error, director) {
          if (error) {
            console.log('INDEX BACK - Update director error', error);
          }
          console.log('INDEX BACK - Update director save', director);
          res.json(director);
        });
    } else {
      console.log('UPDATE - walou pas de director');
      res.json(err);
    }
  })

});


router.get('/getDirectorsList', function(req,res,next){

  // TODO : trouver un moyen de retourner la liste complète des directors

  var https = require('https');

  var options = {
    'method': 'POST',
    'hostname': 'scalr.api.appbase.io',
    'path': '/gpop-data2/_search?q=*.*',
    'headers': {
      'Authorization': 'Basic TVJ3UjB1MDZDOmMwOTAzZDQ4LTdiYWQtNGE4Zi1hZTdmLWM1YzFlMGI4YmI5YQ=='
    }
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      res.json(body);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; ------WebKitFormBoundary7MA4YWxkTrZu0gW--";

  // req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

  req.write(postData);

  req.end();

});

router.get('/deleteDirector', function(req, res, next) {
  directorModel.deleteOne({directorAppbaseId: req.query.directorAppbaseId},
  function (err) {
    if (err) {
      console.log('error', err)
    } else {
      console.log('director deleted')
    }
    var deleteDirector = directorModel.find()
    deleteDirector.exec(function(err, directors) {
        res.json({directors});
      }
    )
  })

  var https = require('https');

  var optionsDelete = {
    'method': 'DELETE',
    'hostname': 'scalr.api.appbase.io',
    'path': `/gpop-data2/_doc/${req.query.directorAppbaseId}`,
    'headers': {
      'Authorization': 'Basic TVJ3UjB1MDZDOmMwOTAzZDQ4LTdiYWQtNGE4Zi1hZTdmLWM1YzFlMGI4YmI5YQ==',
      'Content-Type': 'application/json'
    }
  };

  console.log('optionsUpdate', optionsDelete);

  var updateReq = https.request(optionsDelete, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log('Body', body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var appBaseBody = {
    directorAppbaseId: req.params.directorAppbaseId
  }

  var appBaseData = JSON.stringify(appBaseBody)

  updateReq.write(appBaseData);

  updateReq.end();
});

router.post('/signin', function(req,res,next){
  userModel.findOne({userPassword : req.body.userPassword})
  .exec(function(err, user){
    if (user) {
      console.log('SIGNIN - User trouvé', user);
      res.json(user);
    } else {
      console.log('SIGNIN - walou pas de user');
      res.json(err);
    }
  })


});


module.exports = router;
