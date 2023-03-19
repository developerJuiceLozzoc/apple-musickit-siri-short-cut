const axios = require('axios')
const {
  AppleMusicSearchResult,
  SongSchema,
  AppleArtistSchema,
  AppleArtistSearchResult,
  YoutubeInfoSchema
} = require("./schema.js")


class AppleMusicAPIClient {

  /** We can search for meta data by compairing the first page of results
  * from apple music api by searching for song title, which is present in youtube title.
  * or from songcloud title by searching for song artist, which is also present.
   *
   * @param {string} str Jungled string from soundcloud, youtube≥
   */
 async funtion querySongTitle(str) -> {

 }
 /** https://github.com/Exerra/node-musickit-api
  *
  * @param {string} str Jungled string from soundcloud, youtube≥
  */
 async function querySongArtist(str) {

 }


}


module.exports = {
  AppleMusicAPIClient,
}
