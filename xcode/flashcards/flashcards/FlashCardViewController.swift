//
//  FlashCardViewController.swift
//  baby-flashcards
//
//  Created by Michael Ishmael on 14/05/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit
import CoreGraphics
import AVFoundation

class FlashCardViewController: UIViewController, AVAudioPlayerDelegate {
    
    
    fileprivate var _flashCard:FlashCard? = nil;
    fileprivate var _imageView:UIImageView? = nil;
    fileprivate var _cancelButton:UIButton? = nil;
    fileprivate var _itemSound:AVAudioPlayer? = nil;
    fileprivate var _eventHandler:IApplicationEventHandler;
    fileprivate var _sourceFrame:CGRect;
    var zigzagRecognizer: ZigZagRecognizer!
    var tapRecognizer: UITapGestureRecognizer!
    
    init(flashCard:FlashCard?, sourceFrame:CGRect, eventHandler:IApplicationEventHandler ){
        _flashCard = flashCard;
        _sourceFrame = sourceFrame
        _eventHandler = eventHandler
        super.init(nibName: nil, bundle: nil )
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    var sourceFrame:CGRect{
        get{
            return _sourceFrame;
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.white
        _imageView = UIImageView(frame: self.view.bounds)
        setImageFromOrientation()
        _cancelButton = UIButton.init(type: UIButtonType.custom);
        _cancelButton!.frame = self.view.bounds;
        _cancelButton!.addTarget(self, action: #selector(FlashCardViewController.cancelPressed(_:)), for: .touchUpInside)
        self.view.addSubview(_imageView!)
        self.view.addSubview(_cancelButton!)
        
        let settings = AppSettings.sharedInstance
        if settings.showText {
            addLabel()
        }
        if settings.playSpeech {
            playVoice(playSoundAfterWards: settings.playSound)
        } else if settings.playSound {
            playAnimalSound()
        }
        setupGestureRecognizers()
    }
    
    func setupGestureRecognizers(){
        tapRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.viewTapped(c:)))
        tapRecognizer.numberOfTapsRequired = 1
        tapRecognizer.numberOfTouchesRequired = 1
        tapRecognizer.delegate = self
        view.addGestureRecognizer(tapRecognizer)
        zigzagRecognizer = ZigZagRecognizer(target: self, action: #selector(self.zigZagDrawn(c:)))
        zigzagRecognizer.delegate = self
        view.addGestureRecognizer(zigzagRecognizer)
    }
    
    func viewTapped(c: UITapGestureRecognizer)  {
        if let cancelButton = _cancelButton {
            if cancelButton.frame.contains(c.location(in: self.view)){
                cancelPressed(cancelButton)
            }
        }

    }
    
    func zigZagDrawn(c: ZigZagRecognizer) {
        if c.state == .began {
            //pathDrawer.clear()
        }
        else if c.state == .changed {
            //pathDrawer.updatePath(p: c.path)
        } else if c.state == .ended {
            _eventHandler.settingsRequested()
//            self.parent?.performSegue(withIdentifier: "showSettings", sender: self)
            //            present(vc, animated: true, completion: nil)
        } else {
            //statusLabel.text = "Fail :-("
        }
    }
    
    func addLabel(){
        
        var textColour:String = "ffffff"
        if let testColour = _flashCard?.textLabelColour {
            textColour = testColour
        }
        if let text = _flashCard?.textLabel {
            
            let label = UITextView()
            label.font = UIFont(name: "ChalkboardSE-Bold", size: 50)
            label.textColor = UIColor(hexString: "#" + textColour)
            label.textAlignment = .center
            label.text = text
            label.sizeToFit()
            label.backgroundColor = UIColor(colorLiteralRed: 255, green: 255, blue: 255, alpha: 0)
            let orientation = UIDevice.current.orientation
            let heightRatio:CGFloat = orientation == .portrait ? 0.92 :  0.88
            let calcY = self.view.frame.height * heightRatio
            let calcX = self.view.frame.width / 2
            label.center = CGPoint(x: calcX, y: calcY)
            
            label.layer.shadowOpacity = 0.7;
            label.layer.shadowRadius = 0.8;
            label.layer.shadowColor = UIColor.black.cgColor
            label.layer.shadowOffset = CGSize(width: 2.0, height: 2.0);
            
//            label.backgroundColor = UIColor(colorLiteralRed: 255, green: 255, blue: 255, alpha: 0.5)
//            label.alpha = 0.5
//            label.layer.cornerRadius = 5
//            label.layer.borderColor = UIColor.darkGray.cgColor
//            label.layer.borderWidth = 2
//            label.frame.size.height = label.frame.size.height * 0.74
//            label.frame.size.width = label.frame.size.width * 1.2

//            label.contentOffset = CGPoint(x: 0, y: 15)
            
            self.view.addSubview(label)
        }
    }
    
    func playVoice(playSoundAfterWards: Bool){
        
        var speechFile:String?
        if _flashCard?.speechFile  != nil {
            speechFile = _flashCard!.speechFile
        } else if(_flashCard?.parentDeck?.speechFile != nil){
            speechFile = _flashCard!.parentDeck!.speechFile
        }

        if(speechFile == nil) {
            if(playSoundAfterWards){
                playAnimalSound()
            }
            return
        }
//, inDirectory: "voices/domestic"
        let path = Bundle.main.resourcePath! + "/" + speechFile!
        let fileManager = FileManager.default
        if fileManager.fileExists(atPath: path) {
            playSoundAtPath(path: path, includeDelegate: playSoundAfterWards)
        } else {
            if(playSoundAfterWards){
                playAnimalSound()
            }
        }
        

        

    }
    
    func playAnimalSound(){
        if let animalSound = _flashCard?.sound {
            if let path = Bundle.main.path(forResource: animalSound, ofType: nil, inDirectory: "sounds") {
                playSoundAtPath(path: path, includeDelegate: false)
                return
            }
        }
    }
    
    func playSoundAtPath(path:String, includeDelegate: Bool)  {
        do{

            let songURL = URL(fileURLWithPath: path)
             _itemSound = try AVAudioPlayer.init(contentsOf: songURL, fileTypeHint: AVFileTypeMPEGLayer3)
            _itemSound!.volume = 7;
            _itemSound!.numberOfLoops=0;
            _itemSound!.prepareToPlay()
            if(includeDelegate){
                _itemSound!.delegate = self
            }
            _itemSound!.play();
            
        } catch{
            
        }
    }
    
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully: Bool){
        playAnimalSound()
    }
    
    override var prefersStatusBarHidden : Bool {
        return true
    }
    
    
    func setImageFromOrientation(){
        let orientation = UIDevice.current.orientation
        let crop:FlashCardImageCrop?
        let xCassetName:String?
        
        //  if(_flashCard?.imageDef[].)
        
        if(orientation == UIDeviceOrientation.portrait){
            crop = (_flashCard?.imageDef[AspectRatio.Nine16]?.portrait.crop)
            xCassetName = _flashCard?.imageDef[AspectRatio.Nine16]?.portrait.xCasset
        } else {
            crop = (_flashCard?.imageDef[AspectRatio.Nine16]?.landscape.crop)
            xCassetName = (_flashCard?.imageDef[AspectRatio.Nine16]?.landscape.xCasset)!
        }

        if(xCassetName != nil){
            _imageView!.frame = self.view.bounds;
            if(crop != nil){
                let c = crop!
                _imageView!.layer.contentsRect = //CGRect(x: 0.1, y: 0.1, width: 0.6, height: 0.7)
                    CGRect(x: c.X1, y: c.Y1, width: c.Width, height: c.Height)
            } else {
                _imageView!.layer.contentsRect = CGRect(x: 0, y: 0, width: 1, height: 1)
            }
            _imageView!.image = UIImage.init(named: xCassetName!)
        }

    }
    
    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        coordinator.animate(alongsideTransition: {
            _ in
            self.setImageFromOrientation()
            }, completion: {
            _ in
            
           
        })
    }
    
    func cancelPressed(_ sender: UIButton!){
        _eventHandler.flashCardDismissed()
        _itemSound?.stop()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        _itemSound?.play()
    }

}


extension FlashCardViewController: UIGestureRecognizerDelegate {
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        return true; // !(touch.view?.superview is DeckViewCell)
    }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
}
