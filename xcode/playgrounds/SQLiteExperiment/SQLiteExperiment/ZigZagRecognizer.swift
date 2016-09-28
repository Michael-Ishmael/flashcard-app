//
//  ZigZagRecognizer.swift
//  SQLiteExperiment
//
//  Created by Michael Ishmael on 28/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import UIKit
import UIKit.UIGestureRecognizerSubclass

class ZigZagRecognizer: UIGestureRecognizer {

    private var touchedPoints = [CGPoint]()
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesBegan(touches, with: event)
        if touches.count != 1 {
            state = .failed
        }
        state = .began
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesEnded(touches, with: event)
        
        print(touchedPoints)
        
        state = .failed
    }
    
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesMoved(touches, with: event)
        
        if state == .failed {
            return
        }
        
        let window = view?.window
        if let loc = touches.first?.location(in: window) {
            
            touchedPoints.append(loc)
            
            state = .changed
            
        }
    }
    
}
