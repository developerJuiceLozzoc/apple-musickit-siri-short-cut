//
//  AsyncMetaData.swift
//  RichM4AExporter
//
//  Created by Conner Maddalozzo on 3/20/23.
//

import Foundation
import Cocoa
import AVFoundation

func export(video: AVAsset,
            withMeta meta: [AVMetadataItem]
            withPreset preset: String = AVAssetExportPresetAppleM4A,
            toFileType outputFileType: AVFileType = .m4a,
            atURL outputURL: URL) async -> Bool {
    
    // Check the compatibility of the preset to export the video to the output file type.
    guard await AVAssetExportSession.compatibility(ofExportPreset: preset,
                                                   with: video,
                                                   outputFileType: outputFileType) else {
        print("The preset can't export the video to the output file type.")
        return false
    }
    
    // Create and configure the export session.
    guard let exportSession = AVAssetExportSession(asset: video,
                                                   presetName: preset) else {
        print("Failed to create export session.")
        return false
    }
    exportSession.metadata = meta
    exportSession.outputFileType = outputFileType
    exportSession.outputURL = outputURL
    
    // Convert the video to the output file type and export it to the output URL.
    await exportSession.export()
    return true
}



func metadataItem(_ identifier: AVMetadataIdentifier, value: String?) -> AVMetadataItem {
  let item = AVMutableMetadataItem()
  item.identifier = identifier
  if let value = value {
    item.value = value as NSString
  }
  item.extendedLanguageTag = "und"
  return item.copy() as! AVMetadataItem
}

func metadataArtworkItem(_ imageUrl: URL) async -> AVMetadataItem? {
    do {
        let (data, _) = try await URLSession.shared.data(from: imageUrl)
        let item = AVMutableMetadataItem()
        item.value = data as NSData

        item.dataType = kCMMetadataBaseDataType_PNG as String
        item.identifier = AVMetadataIdentifier.commonIdentifierArtwork
        item.extendedLanguageTag = "und"
        return item as AVMetadataItem
    } catch(let error) {
        print("ERROR: task failed successfully", error)
    }
}
