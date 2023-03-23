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


const SongSchema = new Schema({
  artistName: String,
  trackName: String,
  trackPrice: Number,
  releaseDate: String,
  currency: String,
  trackId: Number,
  genre: String
    /*
    enum CodingKeys: String, CodingKey {
        case artistName,trackName,trackPrice,releaseDate,trackId,currency
        case genre = "primaryGenreName"
    }
    */

})

const BasicSongInfoSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  artist: String,
  genre: String,
  year: String,
  album: String,
  thumbnail: String
});

const AppleMusicSearchResult = new Schema({
    count: Number,
    results: [SongSchema],
    /*
    enum CodingKeys: String, CodingKey {
        case count = "resultCount"
        case results
    }
    */
})


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
