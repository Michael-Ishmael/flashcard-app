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

class FlashCardViewController: UIViewController {
    
    
    fileprivate var _flashCard:FlashCard? = nil;
    fileprivate var _imageView:UIImageView? = nil;
    fileprivate var _cancelButton:UIButton? = nil;
    fileprivate var _itemSound:AVAudioPlayer? = nil;
    fileprivate var _eventHandler:IApplicationEventHandler;
    fileprivate var _sourceFrame:CGRect;
    
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
        

       
        //_itemSound = AVPlayer.init(URL: <#T##NSURL#>) //.init(contentsOfURL: <#T##NSURL#>, fileTypeHint: <#T##String?#>)
        do{
            let path = Bundle.main.path(forResource: _flashCard!.sound, ofType:nil)
            let songURL = URL(fileURLWithPath: path!)
            _itemSound = try AVAudioPlayer.init(contentsOf: songURL, fileTypeHint: AVFileTypeMPEGLayer3)
            _itemSound!.volume = 7;
            //			_itemSound.FinishedPlaying += delegate {
            //				// backgroundMusic.Dispose();
            //				_itemSound = null;
            //			};
            _itemSound!.numberOfLoops=0;
            _itemSound!.play();
        } catch{
            
        }


    }
    
    override var prefersStatusBarHidden : Bool {
        return true
    }
    
    
    func setImageFromOrientation(){
        let orientation = UIDevice.current.orientation
        let crop:FlashCardImageCrop?;
        let xCassetName:String;
        
        //  if(_flashCard?.imageDef[].)
        
        if(orientation == UIDeviceOrientation.portrait){
            crop = (_flashCard?.imageDef[AspectRatio.Nine16]!.portrait.crop)
            xCassetName = (_flashCard?.imageDef[AspectRatio.Nine16]!.portrait.xCasset)!
        } else {
            crop = (_flashCard?.imageDef[AspectRatio.Nine16]!.landscape.crop)
            xCassetName = (_flashCard?.imageDef[AspectRatio.Nine16]!.landscape.xCasset)!
        }

        _imageView!.frame = self.view.bounds;
        if(crop != nil){
            let c = crop!
            _imageView!.layer.contentsRect = //CGRect(x: 0.1, y: 0.1, width: 0.6, height: 0.7)
                CGRect(x: c.X1, y: c.Y1, width: c.X1 + c.Width, height: c.Y1 + c.Height)
        } else {
            _imageView!.layer.contentsRect = CGRect(x: 0, y: 0, width: 1, height: 1)
        }

        _imageView!.image = UIImage.init(named: xCassetName)
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


    
    /*
    
    public override void ViewDidAppear (bool animated)
    {
    //_imageView.SetImage(UIImage.FromBundle(_picPath), UIControlState.Normal);
    _itemSound.Play ();
    }
    
    public FlashCardViewController (FlashCard flashCard, CGRect sourceFrame, IApplicationEventHandler eventHandler)
    {
    _flashCard = flashCard;
    _eventHandler = eventHandler;
    _sourceFrame = sourceFrame;
    }
    
    public CGRect SourceFrame{
    get {
				return _sourceFrame;
    }
    }
    
    */
    
}
