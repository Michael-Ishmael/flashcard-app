//
//  FlashCardSetTabViewController.swift
//  baby-flashcards
//
//  Created by Michael Ishmael on 13/05/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit
import GRDB

protocol IApplicationEventHandler
{
    func deckSelected(_ tile:DeckViewData, frame:CGRect);
    func flashCardDismissed();
    func settingsRequested()
}


class FlashCardSetTabViewController : UITabBarController, IApplicationEventHandler
{
    var _collectionControllers:[UICollectionViewController] = []
    var _pictureController:UIViewController?
    var _clickCount = 0
    var _appData:AppData? = nil
    
    required init?(coder aDecoder: NSCoder) {
        //fatalError("init(coder:) has not been implemented")
        super.init(coder: aDecoder)
       
        let dl = DataLoader()
        
        let appData = dl.getData()
        
        for cardSet in appData!.deckSets{
            let layout = self.getFlowLayout()
            let collectionController = DeckCollectionViewController(layout: layout, cardSet: cardSet, eventHandler: self as IApplicationEventHandler)
            collectionController.collectionView?.contentInset = UIEdgeInsets.init(top: 0, left: 0, bottom: 0, right: 0)
            collectionController.tabBarItem = UITabBarItem();
            let tbi = collectionController.tabBarItem;
            tbi?.imageInsets = UIEdgeInsets.init(top: 6, left: 0, bottom: -6, right: 0)
            tbi?.image = UIImage.init(named: cardSet.icon!)
            self._collectionControllers.append(collectionController)
        }
        
        self.viewControllers = self._collectionControllers;
       
    
    }
    
    func getFlowLayout() -> JumbleFlowLayout{
    
        let flowLayout = JumbleFlowLayout ()
    
            //HeaderReferenceSize = new CGSize (4, 50),
        flowLayout.sectionInset = UIEdgeInsets (top: 20,left: 10,bottom: 4,right: 10);
        flowLayout.scrollDirection = UICollectionViewScrollDirection.vertical;
        flowLayout.minimumInteritemSpacing = 4; // minimum spacing between cells
        flowLayout.minimumLineSpacing = 4 // minimum spacing between rows if ScrollDirection is Vertical or between columns if Horizontal
        let screenSize = UIScreen.main.bounds
        let width = (screenSize.width - 30) / 3
        let height = (screenSize.height - 104 ) / 4
        flowLayout.itemSize = CGSize(width: width, height: height)
    
        return flowLayout;
    }
    
    override var prefersStatusBarHidden : Bool {
        return true
    }
    
    func deckSelected(_ tile:DeckViewData, frame:CGRect){
        
        
        _pictureController = FlashCardViewController(flashCard: tile.getNextFlashCard(), sourceFrame: frame, eventHandler: self as IApplicationEventHandler)
        let tr = FlashCardViewTransitioningDelegate();
        _pictureController!.transitioningDelegate = tr;
        
        self.present(_pictureController!, animated: true, completion: nil);
        _clickCount+=1
        
    }
    
    func flashCardDismissed() {
        dismiss(animated: true, completion: checkAndJumble)
    }
    
    func settingsRequested() {
        let this = self
        dismiss(animated: false, completion: {() -> Void in
                    this.performSegue(withIdentifier: "showSettings", sender: this)
            })

    }
    
    func checkAndJumble(){
        if _clickCount >= 5 {
            _clickCount = 0;
            (selectedViewController as! DeckCollectionViewController).jumble();
        }
    }

    }
    

