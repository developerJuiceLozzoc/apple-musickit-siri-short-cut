const fs = require('fs');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose')
const axios = require("axios")
const { BasicSongInfoSchema } = require('./schema')
const { CobaltAPIClient } = require('./model/cobalt.js')
const { AppleMusicAPIClient } = require('./model/applemusic.js')

const { inspect } = require('util')
const { exec } = require('child_process');


const MusicInfo = mongoose.model('MusicInfo', BasicSongInfoSchema);


function MyNumberType(value, number) {
  this.value = value
  this.number = number
}

MyNumberType.prototype.valueOf = function() {
  return this.number;
};


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
if is soundcloud
curl website and look for
<meta property="og:title" content="POSSESSION PODCAST #134 - REBEKAH">
<meta property="twitter:title" content="POSSESSION PODCAST #134 - REBEKAH">
<meta property="soundcloud:user" content="https://soundcloud.com/possessiontechno">

<div itemscope itemprop="byArtist" itemtype="http://schema.org/MusicGroup">
<meta itemprop="name" content="Possession" />
<meta itemprop="url" content="/possessiontechno" />
</div>


<h1 itemprop="name">
<a itemprop="url"  href="/possessiontechno/possession-podcast-134-rebekah">
POSSESSION PODCAST #134 -	REBEKAH</a>
						by
 <a href="/possessiontechno">Possession</a>
 </h1>

published on <time pubdate>2020-09-15T12:02:01Z</time>

*/

async function statSoundcloudURL(url) {
  const cheerio = require('cheerio');

  try {
    let soundcloudSoup = await axios.get(url)
    let artist = new MusicInfo();
    const $ = cheerio.load(soundcloudSoup.data);
    let poi =[]

    artist.title = $('meta[property=og:title]').attr('content')
    artist.artist = $('meta[property=soundcloud:user]').attr('content')
    // poi.push($('h1[itemprop=name]').siblings().text())
    // console.log(poi)




    // artist.title = ytdlBasicInfo["title"];
    // artist.genre = `Youtube Music's Far Reaches ${ytdlBasicInfo["isFamilySafe"] ? "CLEAN" : "EXPLICIT"}`;
    // artist.year = ytdlBasicInfo["publishDate"];
    // artist.album = `${ytdlBasicInfo["ownerChannelName"]}'s MixTape'`;
    return artist
  } catch (e) {
    console.log(e);
    console.log("ERROR Failed Successfully");
    return undefined;
  }

}


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

songurl = arg

try {
  /*
  3.
  continue to stream file by requesting POST/GET sequence with colbalt.
  */
  let cobalt = new CobaltAPIClient()
  await cobalt.processDownload(songurl)
  const { parseFile } = await import('music-metadata');

  /* get name and artist from file that has been downloaded.*/
  const metadata = await parseFile('./temp/BufferToExport.mp3');

  const appleClient = new AppleMusicAPIClient()
  let result = await appleClient.querySongsByArtist(metadata.common.artist)

  let closestTitle = {
    value: undefined,
    weight: 690000
  }

  result.results.map(function(song) {
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
  finalizedArtistSong.sourceName = metadata.common.title
  finalizedArtistSong.channelArtist = metadata.common.artist
  console.log("writing to file");
  // time to stringify this item, then executre the swift script and be done with it.
  await fs.promises.writeFile('./archive/MostRecentRequest.json', JSON.stringify(finalizedArtistSong))

} catch (e) {
  console.log(e);
  console.log("ERROR Failed Successfully");
  return undefined;
}



/*
4.

 sign off and execute the swift process
*/
console.log('swift swiftBinary');
exec('echo $pwd && ./swiftBinary', (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
  }
  process.exit()

});

}



/* MARK: - bootloader*/
main()
