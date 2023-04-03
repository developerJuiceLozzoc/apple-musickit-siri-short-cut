const fs = require('fs');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose')
const axios = require("axios")
const { BasicSongInfoSchema, SongSchema } = require('./schema')
const { CobaltAPIClient } = require('./model/cobalt.js')
const { AppleMusicAPIClient } = require('./model/applemusic.js')
const {statYoutubeURL} = require('./model/youtube.js')
const SoundloudClient = require('./model/soundcloud.js')

const { inspect } = require('util')
const { exec } = require('child_process');


const MusicInfo = mongoose.model('MusicInfo', BasicSongInfoSchema);


function getEditDistance (a, b){
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};
/* MARK: - Soundcloud */
/*


/* MARK: - Youtube */
/* 1. stat url for information */


/* MARK: - index */
async function main() {


/*
1. receive url from input.
node index.js https://youtu.be/UdgRUCVUts0
node index.js https://soundcloud.com/possessiontechno/possession-podcast-234-whitley
*/


let arg = process.argv[2]
let songurl;


fs.writeFileSync('./temp/args.txt', arg)

songurl = arg

try {
  let cobalt = new CobaltAPIClient()

  if(songurl.includes("soundcloud")) {
    let soundcloudclient = new SoundloudClient()
    let info = await soundcloudclient.statSoundcloudURL(songurl)
    await cobalt.processDownload(info.ogStreamUrl)
  } else {
    await cobalt.processDownload(songurl)
  }


  const { parseFile } = await import('music-metadata');

  /* get name and artist from file that has been downloaded.*/
  const metadata = await parseFile('./temp/BufferToExport.mp3');

  const appleClient = new AppleMusicAPIClient()

  /* here is where we refine results.
   can we trust apple client? or shall we combine both titles
   for each client.
   */
  let result = await appleClient.querySongsByArtist(metadata.common.artist)

  if(result.results.length == 0) {
    let finalizedArtistSong =  new SongSchema(undefined)
    finalizedArtistSong.sourceName = metadata.common.title
    finalizedArtistSong.channelArtist = metadata.common.artist
    finalizedArtistSong.artistName = metadata.common.artist
    finalizedArtistSong.trackName = metadata.common.title


    // time to stringify this item, then executre the swift script and be done with it.
    await fs.promises.writeFile('./archive/MostRecentRequest.json', JSON.stringify(finalizedArtistSong))
  } else {
      let closestTitle = {
        value: undefined,
        weight: 690000
      }
      result.results.filter(function(item){
        return !!item
      }).map(function(song) {
        return {
          value: song,
          weight: getEditDistance(song.trackName, metadata.common.title)
        }
      }).forEach(function(song) {
        if(song.weight < closestTitle.weight) {
          closestTitle = song
        }
      })

      let finalizedArtistSong = closestTitle.value
      finalizedArtistSong.artistName = `${metadata.common.artist}$$${finalizedArtistSong.artistName};`
      finalizedArtistSong.trackName = `${finalizedArtistSong.trackName}$$${metadata.common.title}`


      finalizedArtistSong.sourceName = metadata.common.title
      finalizedArtistSong.channelArtist = metadata.common.artist
      // time to stringify this item, then executre the swift script and be done with it.
      await fs.promises.writeFile('./archive/MostRecentRequest.json', JSON.stringify(finalizedArtistSong))
  }



} catch (e) {
  console.log(e);
  console.log("ERROR Failed Successfully", e);
  fs.writeFileSync("./temp/error.txt", JSON.stringify(e))
  return undefined;
}



/*
4.

 sign off and execute the swift process
*/
exec('echo $pwd && ./swiftBinary', (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    fs.writeFileSync("./temp/error.txt", JSON.stringify(error))
  } else {
   // the *entire* stdout and stderr (buffered)
   fs.writeFileSync("./temp/stdout.txt", JSON.stringify(stdout))
   fs.writeFileSync("./temp/stderr.txt", JSON.stringify(stderr))
  }
  process.exit()

});

}



/* MARK: - bootloader*/
main()
