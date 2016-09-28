//
//  PathDrawer.swift
//  TouchRecognizer
//
//  Created by Michael Ishmael on 28/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import UIKit

class PathDrawer: UIView {
    
    override class var layerClass : AnyClass {
        return CAShapeLayer.self
    }

    var path:CGPath?
    
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

    public func updatePath(p: CGPath?){
        path = p
        setNeedsDisplay()
    }
    
    public func clear(){
        updatePath(p: nil)
    }
    
    override func draw(_ rect: CGRect) {
        if let path = path { // draw a thick yellow line for the user touch path
            if let context = UIGraphicsGetCurrentContext() {
                context.addPath(path)
                context.setStrokeColor(UIColor.red.cgColor)
                context.setLineWidth(10)
                context.setLineCap(.round)
                context.setLineJoin(.round)
                context.strokePath()
            }
        }
    }
}
