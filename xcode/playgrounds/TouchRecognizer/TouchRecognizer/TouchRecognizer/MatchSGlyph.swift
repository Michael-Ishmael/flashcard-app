//
//  MatchSGlyph.swift
//  TouchRecognizer
//
//  Created by Michael Ishmael on 28/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import Foundation
import UIKit

struct IndexedCoord {
    
    var index:Int
    var point:CGPoint
    
    init(index: Int, point: CGPoint){
        self.index = index
        self.point = point
    }
    
    var description:String { return String(format:"index:%@, x:%@, y:5@", self.index, self.point.x, self.point.y) }
    
    
    func isLessThan(other: CGPoint) -> Bool {
        return self.point.x < other.x && self.point.y < other.y
    }
    
    func isGreaterThan(other: CGPoint) -> Bool {
        return self.point.x > other.x && self.point.y > other.y
    }
    
    func getHalfwayPoint(other: CGPoint) -> CGPoint {
        let minX = min(self.point.x, other.x)
        let minY = min(self.point.y, other.y)
        let maxX = max(self.point.x, other.x)
        let maxY = max(self.point.y, other.y)
        
        return CGPoint(x: minX + ((maxX - minX) / 2), y: minY + ((maxY - minY) / 2))
        
    }
    
}

func touchesFormSGlyph(touches: [CGPoint]) -> Bool {
    
    let indexed = touches.enumerated().map { index, point  in  IndexedCoord(index: index, point: point) }  //[IndexedCoord(i, x[0], x[1]) for i, x in enumerate(path)]
    let pA = indexed[0]
    let pB = indexed[indexed.count-1]
    
    let halfWayPoint = pA.getHalfwayPoint(other: pB.point)
    
    let smallers = indexed.filter { ip in ip.isLessThan(other: halfWayPoint) }.map { ip in ip.index }
    let largers = indexed.filter { ip in ip.isGreaterThan(other: halfWayPoint) }.map { ip in ip.index }
    
    if smallers.count == 0 || largers.count == 0{
        return false
    }
    
    let minLge = largers.min()!
    let maxSml = smallers.max()!
    
    let trueOne = !smallers.contains{ x in x > minLge }
    let trueTwo = !largers.contains{ x in x < maxSml}
    let trueThree = !(smallers.contains(0) || largers.contains(0))
    let trueFour = !(smallers.contains(indexed.count - 1) || largers.contains(indexed.count - 1 ))
    
    return trueOne && trueTwo && trueThree && trueFour
    
}

