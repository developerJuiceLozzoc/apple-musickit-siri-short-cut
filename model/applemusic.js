const axios = require('axios')
const {
  AppleMusicSearchResult,
  SongSchema,
  AppleArtistSchema,
  AppleArtistSearchResult,
  YoutubeInfoSchema
} = require("../schema.js")
const { joseSign } = require('../jwt.js')


function minimumDistances(a) {
    let distances = [];
    for(let i = 0; i<a.length; i++){
        if(a.indexOf(a[i]) !== a.lastIndexOf(a[i])){
        let minDistance = a.lastIndexOf(a[i]) - a.indexOf(a[i]);
            distances.push(minDistance);
        }
    }

    if(distances.length === 0){
        return -1;
    }else{
        distances.sort(function(a, b) {
          return a - b;
        });

        return distances[0];
    }
}

class AppleMusicAPIClient {

  /** We can search for meta data by compairing the first page of results
  * from apple music api by searching for song title, which is present in youtube title.
  * or from songcloud title by searching for song artist, which is also present.
   *
   * @param {string} str Jungled string from soundcloud, youtube≥
   */
 async  querySongTitle(str) {

 }
 /** https://github.com/Exerra/node-musickit-api
  *
  * @param {string} str Jungled string from soundcloud, youtube≥
  */
 async  querySongArtist(str) {

 }


 /**
  *
  * @param {string} title song Title
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
    let requestURL = `https://api.music.apple.com/v1/catalog/US/search?term=${searchTerm}&types=songs`
   let { data } = await reqInstance.get(requestURL)
   let
    console.log("Apple music", data,requestURL);
 }

}


module.exports = {
  AppleMusicAPIClient,
}
