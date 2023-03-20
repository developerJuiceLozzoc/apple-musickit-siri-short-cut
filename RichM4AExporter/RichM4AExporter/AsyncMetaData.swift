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
            atURL outputURL: URL) async {
    
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



func metadataItem(_ identifier: String, value: String?) -> AVMetadataItem {
  let item = AVMutableMetadataItem()
  item.identifier = identifier
  if let value = value {
    item.value = value as NSString
  }
  item.extendedLanguageTag = "und"
  return item.copy() as! AVMetadataItem
}

func metadataArtworkItem(_ imageUrl: URL, completion: @escaping (_ item: AVMetadataItem?) -> Void) {
  let task = URLSession.shared.dataTask(with: imageUrl) { data, _, error in
    guard let data = data, let image = UIImage(data: data), error == nil else {
      completion(nil)
      return
    }
    let item = AVMutableMetadataItem()
    if let data = UIImagePNGRepresentation(image) {
      item.value = data as NSData
    }
    item.dataType = kCMMetadataBaseDataType_PNG as String
    item.identifier = AVMetadataCommonIdentifierArtwork
    item.extendedLanguageTag = "und"
    completion(item as AVMetadataItem)
  }
  task.resume()
}
