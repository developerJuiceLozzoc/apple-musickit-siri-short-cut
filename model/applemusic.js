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
   let { data } = await reqInstance.get(requestURL)

   if(data.results.songs.data.length == 25) {
     let requestURL = `https://api.music.apple.com/v1/catalog/US/search?term=${searchTerm}&types=songs&limit=25&offset=25`
    let response2 = await reqInstance.get(requestURL)
   }

    let songs = new AppleMusicSearchResult(data)
    return songs
 }


}


module.exports = {
  AppleMusicAPIClient,
}
