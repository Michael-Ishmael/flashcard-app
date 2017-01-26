//
//  AppSettings.swift
//  flashcards
//
//  Created by Michael Ishmael on 05/10/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit


class AppSettings {
    
    
    static let sharedInstance : AppSettings = {
        let inst = AppSettings()
        return inst
    }()
    
    
    private let _defaults:UserDefaults = UserDefaults.standard
    private let _textSettingKey:String = "SHOW_TEXT"
    private let _speechSettingKey:String = "PLAY_SPEECH"
    private let _soundSettingKey:String = "PLAY_SOUND"
    
    init() {
        if !keyExists(key: _textSettingKey) { showText = true }
        if !keyExists(key: _speechSettingKey) { playSpeech = true }
        if !keyExists(key: _soundSettingKey) { playSound = true }
        
    }
    
    var showText: Bool {
        get{
            return _defaults.bool(forKey: _textSettingKey)
        }
        set(value) {
            _defaults.set(value, forKey: _textSettingKey)
        }
    }
    
    var playSpeech: Bool {
        get{
            return _defaults.bool(forKey: _speechSettingKey)
        }
        set(value) {
            _defaults.set(value, forKey: _speechSettingKey)
        }
    }
    
    var playSound: Bool {
        get{
            return _defaults.bool(forKey: _soundSettingKey)
        }
        set(value) {
            _defaults.set(value, forKey: _soundSettingKey)
        }
    }
    
    private func keyExists(key: String) -> Bool{
        if _defaults.object(forKey: key) != nil{
            return true;
        }
        return false;
    }

}


extension UIColor {
    public convenience init?(hexString: String) {
        let r, g, b, a: CGFloat
        
        if hexString.hasPrefix("#") {
            let start = hexString.index(hexString.startIndex, offsetBy: 1)
            let hexColor = hexString.substring(from: start)
            
            if hexColor.characters.count == 8 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0
                
                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
                    g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
                    b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
                    a = CGFloat(hexNumber & 0x000000ff) / 255
                    
                    self.init(red: r, green: g, blue: b, alpha: a)
                    return
                }
            } else if hexColor.characters.count == 6 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0
                
                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff0000) >> 16) / 255
                    g = CGFloat((hexNumber & 0x00ff00) >> 8) / 255
                    b = CGFloat(hexNumber & 0x0000ff) / 255
                   
                    self.init(red: r, green: g, blue: b, alpha: 1)
                    return
                }
            }
        }
        
        return nil
    }
}
