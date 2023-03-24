const { Schema } = require('mongoose')


const AppleArtistSchema = new Schema({
     name: String,
     linkURL: String,
     artistId: String,
     amgArtistId: String

/*
    enum CodingKeys: String, CodingKey {
        case artistId,amgArtistId
        case name = "artistName"
        case linkURL = "artistLinkUrl"

    }
    */
})
class SongSchema {
  constructor(data) {
    try {
      this.artistName = data.attributes.artistName
      this.trackName = data.attributes.name
      this.releaseDate = data.attributes.releaseDate
      this.genres = data.attributes.genreNames
      this.cover = data.attributes.artwork.url.split("{w}").join("300").split("{h}").join("300")
      const width = data.attributes.artwork.url
      this.album = data.attributes.albumName
    } catch(e) {
      console.log(e);
      this.artistName = "data.attributes.artistName"
      this.trackName = "data.attributes.name"
      this.releaseDate = "data.attributes.releaseDate"
      this.genres = "data.attributes.genreNames"
      this.cover = "data.attributes.artwork.url"
      this.album = data.attributes.albumName
    }
  }
  /*
  enum CodingKeys: String, CodingKey {
      case artistName,trackName,trackPrice,releaseDate,trackId,currency
      case genre = "primaryGenreName"
  }
  */
}

const BasicSongInfoSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  artist: String,
  genre: String,
  year: String,
  album: String,
  thumbnail: String
});


class AppleMusicSearchResult {
  constructor(data) {
    try {
      this.count = data.count
      this.results = data.results.songs.data.map(function(item){return new SongSchema(item)})
    } catch(e){
      console.log(e);
      this.count = 0
      this.results = []
    }
  }
}


const AppleArtistSearchResult = new Schema({
    count: Number,
    results: [AppleArtistSchema]
    /*
    enum CodingKeys: String, CodingKey {
        case count = "resultCount"
        case results
    }
    */
})


module.exports = {
  AppleMusicSearchResult,
  SongSchema,
  AppleArtistSchema,
  AppleArtistSearchResult,
  BasicSongInfoSchema
}
