//
//  CircleGestureRecognizer.swift
//  flashcards
//
//  Created by Michael Ishmael on 27/09/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import Foundation
import UIKit.UIGestureRecognizerSubclass

class CircleGestureRecognizer: UIGestureRecognizer {
    
    
    @objc open func touchesBegan(touches: Set<NSObject>!, withEvent event: UIEvent!) {
        super.touchesBegan(touches as! Set<UITouch>, with: event)
        state = .began
    }
    
    @objc open func touchesEnded(touches: Set<NSObject>!, withEvent event: UIEvent!) {
        super.touchesEnded(touches as! Set<UITouch>, with: event)
        state = .ended
    }
    
}
