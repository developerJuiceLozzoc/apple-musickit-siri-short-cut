const axios = require('axios')

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
class SoundcloudClient {
  async statSoundcloudURL(url) {
    const cheerio = require('cheerio');

    try {
      let soundcloudSoup = await axios.get(url)
      let artist = {}
      const $ = cheerio.load(soundcloudSoup.data);
      let poi =[]

      artist.title = $('meta[property=og:title]').attr('content')
      artist.artist = $('meta[property=soundcloud:user]').attr('content')


      // let soundcloudclient = new SoundcloudClient()
      artist.ogStreamUrl =  $('meta[property=og:url]').attr('content')
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
}



module.exports = SoundcloudClient;
