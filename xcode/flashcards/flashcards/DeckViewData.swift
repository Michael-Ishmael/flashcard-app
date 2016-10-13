//
//  DeckViewData.swift
//  baby-flashcards
//
//  Created by Michael Ishmael on 13/05/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import GRDB

class DataLoader{
    
    func getData() -> AppData? {
        
        var appData = AppData()
        
        do {
            //let dbPath = Bundle.main.url(forResource: "flashcards", withExtension: "db")
            let dbQueue = try DatabaseQueue(path: "/Users/michaelishmael/Dev/Projects/flashcard-app/xcode/flashcards/flashcards/flashcards.db" ) //  (dbPath?.absoluteString)!) //"/Users/michaelishmael/Dev/Projects/flashcard-app/xcode/flashcards/flashcards/flashcards.db")
            
            dbQueue.inDatabase {db in
                let sets = DbFcSet.fetchAll(db, "Select s.set_id, s.name, mf.xcasset as icon, s.display_order " +
                    "from [set] s " +
                    "join media_file mf on s.icon_id = mf.media_file_id")
                
                for set in sets{
                    
                    var fcSet = FlashCardSet(dbSet: set)
                    
                    let deck_query = "select d.deck_id, d.set_id, d.name, mf.xcasset as icon, d.display_order " +
                        "from deck d " +
                        "join media_file mf on d.icon_id = mf.media_file_id " +
                        "where d.set_id = " + String(set.id)
                    
                    let decks = DbFcDeck.fetchAll(db, deck_query)
                    for deck in decks {
                        
                        var fcDeck = FlashCardDeck(dbDeck: deck)
                        
                        let card_query = "select  c.card_id, c.deck_id, c.name, mf.name as sound, c.display_order, c.label, c.label_colour " +
                            "from card c " +
                             "join media_file mf on c.sound_id = mf.media_file_id " +
                            "where c.deck_id = " + String(deck.id)
                        
                        let cards = DbFcCard.fetchAll(db, card_query)
                        
                        for card in cards {
                            
                            var fcCard = FlashCard(dbCard: card, parent: fcDeck)
                            //fcCard.textLabel = fcDeck.name
                            let format_query = "select ctd.card_id, td.aspect_ratio_id, (pt_xcasset_name is null or trim(pt_xcasset_name) = '' ) as combined, " +
                                "ctd.ls_xcasset_name, ctd.pt_xcasset_name, ctd.ls_crop_x as l_x, ctd.ls_crop_y as l_y, " +
                                "ctd.ls_crop_w as l_w, ctd.ls_crop_h as l_h, ctd.pt_crop_x as p_x, " +
                                "ctd.pt_crop_y as p_y, ctd.pt_crop_w as p_w, ctd.pt_crop_h as p_h " +
                                "from card_target_device ctd " +
                                "join target_device td on ctd.target_device_id = td.target_device_id " +
                                "where ctd.card_id = " + String(card.id) +
                            " group by td.aspect_ratio_id";
                            
                            let formats = DbFcImageFormat.fetchAll(db, format_query)
                            for format in formats{
                                
                                let fcFormat = ImageFormatDef(dbFormat: format)
                                let aspectRatio = format.aspectRatioId == 1 ? AspectRatio.Twelve16 : AspectRatio.Nine16;
                                fcCard.imageDef[aspectRatio] = fcFormat
                                
                            }
                            fcDeck.cards.append(fcCard)

                            
                        }
                        fcSet.decks.append(fcDeck)
                    }
                    appData.deckSets.append(fcSet)
                }
                
            }
            
            return appData
        } catch let ex {
            print(ex)
            return nil
        }
        
    }
    
}


public struct FlashCardImageCrop
{
    var X1:Double
    var Y1:Double
    var Width:Double
    var Height:Double
    
    public init(dbFormat: DbFcImageFormat, orientation:ImageOrientation) {
        
        if(orientation == ImageOrientation.Landscape){
            self.X1 = dbFormat.lx!
            self.Y1 = dbFormat.ly!
            self.Width = dbFormat.lw!
            self.Height = dbFormat.lh!
        } else {
            self.X1 = dbFormat.px!
            self.Y1 = dbFormat.py!
            self.Width = dbFormat.pw!
            self.Height = dbFormat.ph!
        }

    }
    
    var X2:Double{
        get{
            return Width + X1
        }
    }
    
    var Y2:Double{
        get{
            return Height + Y1
        }
    }
    
}


public struct ImgSrc
{
    var xCasset:String
    var crop:FlashCardImageCrop? = nil
    
    public init(dbFormat: DbFcImageFormat, orientation:ImageOrientation, imageType:ImageType){
        
        if(orientation == ImageOrientation.Landscape){
            self.xCasset = dbFormat.lsCassetName!
        } else {
            if(imageType == ImageType.Combined){
                self.xCasset = dbFormat.lsCassetName!
            } else {
                self.xCasset = dbFormat.ptCassetName!
            }
            

        }
        if(imageType == ImageType.Combined){
            self.crop = FlashCardImageCrop(dbFormat: dbFormat, orientation: orientation)
        }

    }
    
}

public struct ImageFormatDef
{
    var landscape:ImgSrc
    var portrait:ImgSrc
    var imageType:ImageType
    
    public init(dbFormat: DbFcImageFormat){
        
        if(dbFormat.combined){
            self.imageType = ImageType.Combined
            
        } else {
            self.imageType = ImageType.Split
        }

        self.landscape = ImgSrc(dbFormat: dbFormat, orientation: ImageOrientation.Landscape, imageType: self.imageType)
        self.portrait = ImgSrc(dbFormat: dbFormat, orientation: ImageOrientation.Portrait, imageType: self.imageType)
    }
    
}

public struct FlashCard
{
    var id:Int = 0
    var index:Int = 0
    var sound:String? = nil
    var imageDef:[AspectRatio: ImageFormatDef] = [:]
    var textLabel:String? = nil
    var textLabelColour:String? = nil
    var parentDeck:FlashCardDeck? = nil
    
    public init(dbCard: DbFcCard, parent:FlashCardDeck) {
        
        self.id = dbCard.id
        self.index = dbCard.displayOrder
        self.sound = dbCard.sound
        self.textLabel = dbCard.label
        self.textLabelColour = dbCard.labelColour
        self.parentDeck = parent
    }
}

extension Dictionary {
    init(_ pairs: [Element]) {
        self.init()
        for (k, v) in pairs {
            self[k] = v
        }
    }
}


public struct FlashCardDeck  {
    
    var id:Int = 0
    var name:String = ""
    var thumb:String? = ""
    var cards:[FlashCard] = []
    
    public init(dbDeck:DbFcDeck){
        self.id = dbDeck.id
        self.name = dbDeck.name
        self.thumb = dbDeck.icon
    }

}

public struct FlashCardSet  {
    
    public var id:Int = 0
    public var name:String = ""
    public var icon:String? = ""
    public var decks:[FlashCardDeck] = []
    
    public init(dbSet:DbFcSet){
        self.id = dbSet.id
        self.name = dbSet.name
        self.icon = dbSet.icon
    }

}

public struct AppData  {
    public var deckSets:[FlashCardSet] = []

}

class DeckViewData
{
    var _index = -1;
    var  _deck:FlashCardDeck;
    
    init (deck:FlashCardDeck)
    {
        _deck = deck;
    }
    
    var caption:String {
        get {
            return _deck.name;
        }
    }
    
    var imageThumb:String {
        get {
            return _deck.thumb!
        }
    }
    
    var thumbId:Int {
        return _deck.id;
    }
    
    func getNextFlashCard() -> FlashCard?{
        if _deck.cards.count > 0 {
            incrementIndex()
            return _deck.cards[_index]
        } else {
            return nil
        }
    }
    
    func incrementIndex() {
        if (_index == _deck.cards.count - 1) {
            _index = 0
        } else {
            _index += 1
        }
    }

}
