//
//  Entities.swift
//  flashcards
//
//  Created by Michael Ishmael on 23/09/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import GRDB

public enum AspectRatio : String
{
    case Nine16 = "nine16"
    case Twelve16 = "twelve16"
    
}

public enum ImageOrientation : String
{
    case Landscape = "landscape"
    case Portrait = "portrait"
}

public enum ImageType : String
{
    case Combined = "combined"
    case Split = "split"
}


public struct DbFcSet : RowConvertible {
    
    public var id:Int = 0
    public var name:String = ""
    public var icon:String? = ""
    public var displayOrder:Int = 0
    
    public init(row: Row) {
        
        self.id = row.value(named: "set_id")
        self.name = row.value(named: "name")
        self.icon = row.value(named: "icon")
        self.displayOrder = row.value(named: "display_order")
    }
    

}

public struct DbFcDeck : RowConvertible {
    
    public var id:Int = 0
    public var setId:Int = 0
    public var name:String = ""
    public var icon:String? = ""
    public var displayOrder:Int = 0
    
    public init(row: Row) {
        
        self.id = row.value(named: "deck_id")
        self.setId = row.value(named: "set_id")
        self.name = row.value(named: "name")
        self.icon = row.value(named: "icon")
        self.displayOrder = row.value(named: "display_order")
    }
    
}

public struct DbFcCard : RowConvertible {
    
    public var id:Int = 0
    public var deckId:Int = 0
    public var name:String = ""
    public var sound:String? = ""
    public var displayOrder:Int = 0
    public var label:String = ""
    public var labelColour:String = ""
    
    public init(row: Row) {
        
        self.id = row.value(named: "card_id")
        self.deckId = row.value(named: "deck_id")
        self.name = row.value(named: "name")
        self.sound = row.value(named: "sound")
        self.displayOrder = row.value(named: "display_order")
        self.label = row.value(named: "label")
        self.labelColour = row.value(named: "label_colour")

    }
    
}

public struct DbFcImageFormat : RowConvertible {
    
    public var cardId:Int = 0
    public var aspectRatioId:Int = 0
    public var combined:Bool = true
    public var lsCassetName:String? = nil
    public var ptCassetName:String? = nil
    public var lx:Double? = nil
    public var ly:Double? = nil
    public var lw:Double? = nil
    public var lh:Double? = nil
    public var px:Double? = nil
    public var py:Double? = nil
    public var pw:Double? = nil
    public var ph:Double? = nil

    
    public init(row: Row) {
        
        self.cardId = row.value(named: "card_id")
        self.aspectRatioId = row.value(named: "aspect_ratio_id")
        self.lsCassetName = row.value(named: "ls_xcasset_name")
        self.ptCassetName = row.value(named: "pt_xcasset_name")
        self.combined = row.value(named: "combined")
        self.lx = row.value(named: "l_x")
        self.ly = row.value(named: "l_y")
        self.lw = row.value(named: "l_w")
        self.lh = row.value(named: "l_h")
        self.px = row.value(named: "p_x")
        self.py = row.value(named: "p_y")
        self.pw = row.value(named: "p_w")
        self.ph = row.value(named: "p_h")

    }
    
}

