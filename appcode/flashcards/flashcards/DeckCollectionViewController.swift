//
//  DeckCollectionViewController.swift
//  baby-flashcards
//
//  Created by Michael Ishmael on 16/05/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit

class DeckCollectionViewController : UICollectionViewController {
    
    let deckViewCellId:NSString = NSString.init(string: "DeckViewCell");
    var zigzagRecognizer: ZigZagRecognizer!
    var tapRecognizer: UITapGestureRecognizer!
    
    fileprivate var _eventHandler:IApplicationEventHandler? = nil
    fileprivate var _tiles:[DeckViewData] = [];
    
    init (layout:UICollectionViewLayout, cardSet:FlashCardSet, eventHandler:IApplicationEventHandler)
    {
        _eventHandler = eventHandler;
        super.init(collectionViewLayout: layout)
        
        for deck in cardSet.decks{
            _tiles.append(DeckViewData(deck: deck))
        }
    }

    required init?(coder aDecoder: NSCoder) {
        //fatalError("init(coder:) has not been implemented")
        super.init(coder: aDecoder)
    }
    
    var tiles:[DeckViewData] {
        get {
            return _tiles;
        }
    }
    
    override var prefersStatusBarHidden : Bool {
        return true
    }
    
    override func viewDidLoad ()
    {
        super.viewDidLoad ();

        super.collectionView?.register(DeckViewCell.self, forCellWithReuseIdentifier: deckViewCellId as String)
        super.collectionView!.backgroundView = UIView.init(frame: self.collectionView!.bounds);
        super.collectionView!.backgroundView!.backgroundColor = UIColor.white
        UIMenuController.shared.menuItems = [
         UIMenuItem.init(title: "Custom", action: Selector.init(("custom")))
        ];
        
        setupGestureRecognizers()
        
    }
    
    func setupGestureRecognizers(){
        tapRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.cellTapped(c:)))
        tapRecognizer.numberOfTapsRequired = 1
        tapRecognizer.numberOfTouchesRequired = 1
        tapRecognizer.delegate = self
        view.addGestureRecognizer(tapRecognizer)
        zigzagRecognizer = ZigZagRecognizer(target: self, action: #selector(self.zigZagDrawn(c:)))
        zigzagRecognizer.delegate = self
        view.addGestureRecognizer(zigzagRecognizer)
    }

    func cellTapped(c: UITapGestureRecognizer)  {
        let pointInCollectionView: CGPoint = c.location(in: collectionView)
        if let selectedIndexPath: IndexPath =  (self.collectionView?.indexPathForItem(at: pointInCollectionView)){
            let item = _tiles[(selectedIndexPath as IndexPath).row]
            let cell = self.collectionViewLayout.layoutAttributesForItem(at: selectedIndexPath)
            _eventHandler?.deckSelected(item, frame: (cell?.frame)!)
        }
    }
    
    func zigZagDrawn(c: ZigZagRecognizer) {
        if c.state == .began {
            //pathDrawer.clear()
        }
        else if c.state == .changed {
            //pathDrawer.updatePath(p: c.path)
        } else if c.state == .ended {
            self.parent?.performSegue(withIdentifier: "showSettings", sender: self)
            //            present(vc, animated: true, completion: nil)
        } else {
            //statusLabel.text = "Fail :-("
        }
    }

    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1;
    }
    
    
    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return _tiles.count
    }
    
    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = self.collectionView?.dequeueReusableCell(withReuseIdentifier: deckViewCellId as String, for: indexPath) as! DeckViewCell
        
        cell.layer.isHidden = false;
        
        let tile = _tiles[(indexPath as NSIndexPath).row]
        
        cell.setImagePath(tile.imageThumb)
        cell.tag = tile.thumbId
        
        
        return cell;
    }

    override func collectionView(_ collectionView: UICollectionView, shouldSelectItemAt indexPath: IndexPath) -> Bool {
        return true;
    }
    
    override var canBecomeFirstResponder : Bool {
        return true;
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.becomeFirstResponder()
    }
    

    
    override func motionEnded(_ motion: UIEventSubtype, with event: UIEvent!) {
        super.motionEnded(motion, with: event)
        if(event.subtype == UIEventSubtype.motionShake) {
            self.jumble()
        }
    }
    
    func jumble(){
        self.collectionView?.performBatchUpdates({
            self.shuffleTileArray()
            self.collectionView?.reloadSections(IndexSet(integer: 0))
            }, completion: {
        _ in
//                self.collectionView?.performBatchUpdates({
//                    self.shuffleTileArray()
//                    self.collectionView?.reloadSections(NSIndexSet(index: 0))
//                    }, completion: nil)
                
        })
    }
    
    //Fisher-Yates
    func shuffleTileArray(){
        let count = _tiles.count;
        if count < 2 { return }
        
        for i in 0..<count - 1 {
            let j = Int(arc4random_uniform(UInt32(count - i))) + i;
            guard i != j else { continue }
            //print("j=\(j), i=\(i) \(_tiles[i].imageThumb) -> \(_tiles[j].imageThumb)")
            swap(&_tiles[i], &_tiles[j])
        }

        return
    }


    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        coordinator.animate(alongsideTransition: {
                _ in
            
            let orientation = UIDevice.current.orientation;
            //print("From orientation: \(interfaceOrientation.isLandscape ? "Landscape" : "Portrait")")
            
            guard let flowLayout = self.collectionView?.collectionViewLayout as? JumbleFlowLayout else {
                return
            }
            
            //let size = flowLayout.collectionViewContentSize()
            let screenSize = UIScreen.main.bounds

            if orientation.isLandscape {
                //print("Orientation: Landscape, Width: \(size.width), Height: \(size.height)")
                let width = (screenSize.width - 40) / 6
                let height = (screenSize.height - 95 ) / 2

                flowLayout.itemSize = CGSize(width: width, height: height)
                
            } else {
                let width = (screenSize.width - 30) / 3
                let height = (screenSize.height - 104 ) / 4
                //print("Orientation: Portrait, Width: \(size.width), Height: \(size.height)")
                flowLayout.itemSize = CGSize(width: width, height: height)
            }
            
            //print("Current ItemSize: Width: \(flowLayout.itemSize.width), Height: \(flowLayout.itemSize.height)")
            
            
            
            }, completion: {
            _ in
            
                guard let flowLayout = self.collectionView?.collectionViewLayout as? JumbleFlowLayout else {
                    return
                }
                
            flowLayout.doneRotation()
            self.jumble()
        })
    }

    
}

extension DeckCollectionViewController: UIGestureRecognizerDelegate {
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        return true; // !(touch.view?.superview is DeckViewCell)
    }

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
}


extension Array{
   
    mutating func shuffle(){
        var n = self.count;
        while(n > 2){
            n -= 1;
            var k = Int(arc4random_uniform(UInt32(n)) + 1)
            while(k == n){
                k = Int(arc4random_uniform(UInt32(n)) + 1)
            }
            let value = self[k];
            self[k] = self[n];
            self[n] = value;
        }
        return
    }
    
}








