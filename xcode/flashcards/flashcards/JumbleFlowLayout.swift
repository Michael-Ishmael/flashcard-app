//
//  JumbleFlowLayout.swift
//  baby-flashcards
//
//  Created by Michael Ishmael on 13/05/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit

class JumbleFlowLayout : UICollectionViewFlowLayout {
    
    var _lastPositions = [Int: PosStore]()
    var _firstRun = false;
    var _hold = false
    
    override func prepare() {
        super.prepare()
        if(!_firstRun){
            calculatePositions()
            _firstRun = true;
        }
        
    }
    
    fileprivate func calculatePositions(){
        if let cellCount =  collectionView?.numberOfItems(inSection: 0) {
            for i in 0...(cellCount-1) {
                let itemIndexPath = IndexPath(item: i, section: 0)
                let item = (collectionView?.dataSource as! DeckCollectionViewController!).tiles[(itemIndexPath as NSIndexPath).row]
                let attributes = self.layoutAttributesForItem(at: itemIndexPath)
                
                if _lastPositions[item.thumbId] == nil {
                    _lastPositions[item.thumbId] = PosStore()
                }
                if let centerPos = attributes?.center {
                    _lastPositions [item.thumbId]?.storePos (centerPos);
                }
            }
        }
    }
    
    internal func doneRotation(){
        _lastPositions = [Int: PosStore]()
        calculatePositions()
        _hold = false;
    }
    
    override func prepare(forCollectionViewUpdates updateItems: [UICollectionViewUpdateItem]) {
        calculatePositions()
        super.prepare(forCollectionViewUpdates: updateItems)
    }
    
    override func invalidateLayout() {
        super.invalidateLayout()
        //calculatePositions()
    }
    
    override func prepare(forAnimatedBoundsChange oldBounds: CGRect) {
        //calculatePositions()
        super.prepare(forAnimatedBoundsChange: oldBounds)
        _hold = true;
    }
    
    override func initialLayoutAttributesForAppearingItem(at itemIndexPath: IndexPath) -> UICollectionViewLayoutAttributes? {
        
        let attributes = super.initialLayoutAttributesForAppearingItem(at: itemIndexPath)
        
        if(_hold) { return attributes};
        
        let item = (self.collectionView?.dataSource as! DeckCollectionViewController).tiles[(itemIndexPath as NSIndexPath).row]
        attributes?.alpha = 1
        attributes?.center = (_lastPositions[item.thumbId]?.lastPos)!
        
        return attributes
        
    }
    
    override func finalLayoutAttributesForDisappearingItem(at itemIndexPath: IndexPath) -> UICollectionViewLayoutAttributes? {
        
        let attributes = super.initialLayoutAttributesForAppearingItem(at: itemIndexPath)
        
        if(_hold) { return attributes};
        
        let cell = self.collectionView?.cellForItem(at: itemIndexPath) as! DeckViewCell
        cell.layer.isHidden = true;
        cell.layer.removeAllAnimations()
        
        return attributes
    }
    
    
    class PosStore
    {
        var _lastPos:CGPoint? = nil
        var nextPos:CGPoint = CGPoint (x: 0, y: 0);
    
        func storePos(_ pos:CGPoint) {
            _lastPos = nextPos;
            nextPos = pos;
        }
        
        var lastPos: CGPoint {
            get{
                if(_lastPos == nil){
                    return nextPos;
                }
                return _lastPos!;
            }
        }
        
    }
    
}
