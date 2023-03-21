//
//  main.swift
//  RichM4AExporter
//
//  Created by Conner Maddalozzo on 3/20/23.
//

import Foundation
import Cocoa
import AVFoundation

print("Hello, World!")

struct ItunesArtist: Codable {
    var title: String
}

let semaphore = DispatchSemaphore(value: 1)

func myAsset() -> AVAsset? {
    nil
}

func metadata(for artist: ItunesArtist) async -> [AVMetadataItem] {
    []
}


func exportUrl(for artist: String) -> URL? {
    return nil
}




Task {
//    await export(video: video,
//                 withPreset: AVAssetExportPresetHighestQuality,
//                 toFileType: .mov,
//                 atURL: outputURL)
    
    
    semaphore.signal()
}

semaphore.wait()
