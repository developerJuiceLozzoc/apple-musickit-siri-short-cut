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
    var title: String
    var artist: String
    var albumArtist: String
    var genre: String
    var yearPublished: String
    var thumbnail: String
    var album: String
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
    if let url = URL(string: artist.thumbnail),
       let mediaMetaData = await metadataArtworkItem(url) {
        metas.append(mediaMetaData)
    }
    
    metas.append(metadataItem(.iTunesMetadataSongName, value: artist.title))
    metas.append(metadataItem(.iTunesMetadataGenreID, value: artist.genre))
    metas.append(metadataItem(.iTunesMetadataArtist, value: artist.artist))
    metas.append(metadataItem(.iTunesMetadataAlbum, value: artist.album))

    
    
    return metas
}


func myExportUrl(for artist: String) -> URL? {
    URL(filePath: FileManager.default.currentDirectoryPath)
    .appendingPathComponent("portal/\(artist)-\(Int(Date.now.timeIntervalSince1970 / 1000)).m4a")
}

Task {
    guard let json = getLatestJson(),
          let exportUrl = myExportUrl(for: json.artist),
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
        print("Successfully exported song: \(json.title)")
    }
    
    
    semaphore.signal()
}

semaphore.wait()
