const fs = require('fs');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose')
const axios = require("axios")
const { BasicSongInfoSchema } = require('./schema')
const { CobaltAPIClient } = require('./model/cobalt.js')
const { AppleMusicAPIClient } = require('./model/applemusic.js')

const { inspect } = require('util')


const MusicInfo = mongoose.model('MusicInfo', BasicSongInfoSchema);

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
  // let cobalt = new CobaltAPIClient()
  //
  // await cobalt.processDownload(songurl)
  const { parseFile } = await import('music-metadata');

  /* get name and artist from file that has been downloaded.*/
  const metadata = await parseFile('./temp/BufferToExport.mp3');

  const appleClient = new AppleMusicAPIClient()
  let songs = await appleClient.querySongsByArtist(metadata.common.artist)
  console.log(metadata.common.title);
  console.log(metadata.common.artist);

} catch (e) {
  console.log(e);
  console.log("ERROR Failed Successfully");
  return undefined;
}



/*
4.
write file as a rich mp4? mp3? idk soething that itunes can read. perhaps photo.
*/

/*
5.
place in folder
*/

process.exit()
}



/* MARK: - bootloader*/
main()
