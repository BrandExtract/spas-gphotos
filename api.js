/*jshint node:true,expr:true*/
'use strict';

var spashttp = require("spas-http");
var async = require("async");

exports.albumsWithPhotos = function(params, credentials, cb) {
  var BASEURL = "https://picasaweb.google.com/data/feed/api/user/";
  params.url = BASEURL + params.userid;

  spashttp.request(params, credentials, function(err, result) {
    if (!err) {
      async.each(result.data.items, function(album, callback) {
        var shadowed = JSON.parse(JSON.stringify(params));
        shadowed.url = shadowed.url + "/albumid/" + album.id;
        spashttp.request(shadowed, credentials, function(err, photos) {
          if (photos.data && photos.data.items) {
            album.photos = photos.data.items;
          }
          callback();
        });
      }, function(error) {
        if (error) {
          console.log(error);
        } else {
          cb(err,result);
        }
      });
    } else {
      cb(err, {});
    }
  });
};
