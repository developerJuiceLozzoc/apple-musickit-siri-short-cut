//
//  main.swift
//  RichM4AExporter
//
//  Created by Conner Maddalozzo on 3/20/23.
//

import Foundation

print("Hello, World!")

let semaphore = DispatchSemaphore(value: 1)





Task {
    await export(video: video,
                 withPreset: AVAssetExportPresetHighestQuality,
                 toFileType: .mov,
                 atURL: outputURL)
    
    
    semaphore.signal()
}

semaphore.wait()
