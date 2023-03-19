const fs = require('fs');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose')
const axios = require("axios")
const { BasicSongInfoSchema } = require('./schema')

const YoutubeBasicInfoSchema = mongoose.model('MusicInfo', BasicSongInfoSchema);

/* MARK: - Youtube */
/* 1. stat url for information */
async function statYoutubeURL(url) {
  try {
    let ytdlBasicInfo = await ytdl.getInfo(url)
    console.log(Object.keys(ytdlBasicInfo))
    let artist = new YoutubeBasicInfoSchema();
    artist.title = ytdlBasicInfo["videoDetails"]["title"];
    artist.genre = `Youtube Music's Far Reaches ${ytdlBasicInfo["videoDetails"]["isFamilySafe"] ? "CLEAN" : "EXPLICIT"}`;
    artist.year = ytdlBasicInfo["videoDetails"]["publishDate"];
    artist.album = `${ytdlBasicInfo["videoDetails"]["ownerChannelName"]}'s MixTape'`;
    artist.artist = "It might be owner of this album"
    const thumbnails = ytdlBasicInfo["videoDetails"]["thumbnails"]
      .filter(function(thumbnail) {
         return thumbnail["height"] < 150
      })
    artist.thumbnail = thumbnails[Math.floor(Math.random()*thumbnails.length)]["url"]

    return artist
  } catch (e) {
    console.log(e);
    console.log("ERROR Failed Successfully");
    return undefined;
  }

}

/** Uses the ytdl core npmjs package to create a writeable file stream.
 *
 * Returns the stream to be piped later when the filename is created.
 * @param {string} str Jungled string from soundcloud, youtube≥
 * @param {writeStream} writeStream  lazy creates the readStream.
         .pipe(writeStream);
 */
async function createYoutubeStream(url) {
    try {
      ytdl(url)
    } catch (e) {
      console.log(e);
      console.log("ERROR Failed Successfully");
      return undefined;
    }

  }
}

module.exports = {
  statYoutubeURL,
  createYoutubeStream
}
