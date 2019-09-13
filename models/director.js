var mongoose = require('mongoose');

var subCatSchema = mongoose.Schema({
  subCatLabel: String,
});

var videoSchema = mongoose.Schema({
  videoUrl: String,
  videoSource: String,
});

var directorSchema = mongoose.Schema({
  directorName: String,
  directorLoca : String,
  directorCat : String,
  directorSubCat : [subCatSchema],
  directorTypePrint : Boolean,
  directorTypeFilm : Boolean,
  directorTypeDop : Boolean,
  directorSituation : String,
  directorContent : String,
  directorContactEmail : Date,
  directorContactPhone: String,
  directorLabel: String,
  directorReckitt : String,
  directorContacted : String,
  directorWebsite : String,
  directorVimeo : String,
  directorInsta : String,
  directorVideos : [videoSchema],
});

// Export pour utilisation dans les routes (collection + schéma)
module.exports = mongoose.model('directors', directorSchema);