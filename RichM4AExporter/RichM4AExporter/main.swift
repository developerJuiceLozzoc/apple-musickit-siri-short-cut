//
//  main.swift
//  RichM4AExporter
//
//  Created by Conner Maddalozzo on 3/20/23.
//

import Foundation
import Cocoa
import AVFoundation


struct ItunesArtist: Codable {
    var artistName: String
    var trackName: String
    var genres: [String]
    var releaseDate: String
    var cover: String
    var album: String
    var channelArtist: String
    var sourceName: String
}

let semaphore = DispatchSemaphore(value: 0)


func getLatestJson() -> ItunesArtist? {
    do {
        guard let path = Bundle.path(
            forResource: "MostRecentRequest",
                ofType: "json",
                inDirectory: "archive"),
              let data = try? Data(contentsOf: URL(filePath: path))
        else {
            return nil
        }
        return try JSONDecoder().decode(ItunesArtist.self, from: data)
    } catch(let error) {
        print("ERROR: Task Failed Successfully", error)
        return nil
    }
}

func myAsset() -> AVAsset? {
    guard let path = Bundle.path(
        forResource: "BufferToExport",
            ofType: "mp3",
            inDirectory: "temp")
    else {
        return nil
    }
    
    return AVAsset(url: URL(filePath: path))
}

func metadata(for artist: ItunesArtist) async -> [AVMetadataItem] {
    var metas = [AVMetadataItem]()
    if let url = URL(string: artist.cover),
       let mediaMetaData = await metadataArtworkItem(url) {
        metas.append(mediaMetaData)
    }
    
    metas.append(metadataItem(.iTunesMetadataSongName, value: artist.trackName))
    
    artist.genres.forEach { genre in
        metas.append(metadataItem(.iTunesMetadataGenreID, value: genre))
    }
    metas.append(metadataItem(.iTunesMetadataAlbum, value: artist.album))
    
    metas.append(metadataItem(.iTunesMetadataArtist, value: artist.artistName))
    metas.append(metadataItem(.iTunesMetadataAlbumArtist, value: artist.channelArtist))
    if let json = try? JSONEncoder().encode(artist) {
        let jsonString = String(data: json, encoding: .utf8)
        metas.append(metadataItem(.id3MetadataComments, value: jsonString))
    }

    
    
    return metas
}


func myExportUrl(for artist: String) -> URL? {
    URL(filePath: FileManager.default.currentDirectoryPath)
    .appendingPathComponent("portal/\(artist)-\(Int(Date.now.timeIntervalSince1970 / 1000)).m4a")
}

Task {
    guard let json = getLatestJson(),
          let exportUrl = myExportUrl(for: json.artistName),
          let asset = myAsset()
    else {
        semaphore.signal()
        return
    }
    let metas = await metadata(for: json)
    let success = await export(
        video: asset,
        withMeta: metas,
        atURL: exportUrl
    )
    
    if success {
        print("Successfully exported song: \(json.trackName)")
    }
    
    
    semaphore.signal()
}

semaphore.wait()
