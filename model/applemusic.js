const axios = require('axios')
const {
  AppleMusicSearchResult,
  SongSchema,
  AppleArtistSchema,
  AppleArtistSearchResult,
  YoutubeInfoSchema
} = require("../schema.js")
const { joseSign } = require('../jwt.js')


class AppleMusicAPIClient {

 /** We grab the first 50 songs by the artist and see if the one we want is in that list.... idk
  *
  * @param {string} artist song artist
  * returns
  */
 async  querySongsByArtist(artist) {
   let token = await joseSign();
   let reqInstance = axios.create({
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
    let searchTerm =  artist.split(" ").join("+")
    let requestURL = `https://api.music.apple.com/v1/catalog/US/search?term=${searchTerm}&types=songs&limit=25`
   let resp = await reqInstance.get(requestURL)

   if(!resp.data) {
     return {results: []}
   }
   let {data} = resp;
   if(Object.keys(data.results).length == 0  || data.results.length == 0) {
     return {results: []}

   } else  if (data.results.songs.data.length == 0 ) {
     return {results: []}
   }

   if(data.results.songs.data.length == 25) {

     let requestURL = `https://api.music.apple.com/v1/catalog/US/search?term=${searchTerm}&types=songs&limit=25&offset=25`
    let response2 = await reqInstance.get(requestURL)
    var aplle2 = []
    if(!!response2.results && !! response2.results.songs.data.length > 0) {
      aplle2 = new AppleMusicSearchResult(response2)
      aplle2 = aplle2.results
    }

   }


    let songs = new AppleMusicSearchResult(data)
    songs.results = songs.results.concat(aplle2)
    return songs
 }


}


module.exports = {
  AppleMusicAPIClient,
}
