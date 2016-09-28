//
//  ViewController.swift
//  TouchRecognizer
//
//  Created by Michael Ishmael on 28/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    var zigzagRecognizer: ZigZagRecognizer!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        zigzagRecognizer = ZigZagRecognizer(target: self, action: #selector(self.zigZagDrawn(c:)))
        view.addGestureRecognizer(zigzagRecognizer)
        
    }
    
    func zigZagDrawn(c: ZigZagRecognizer) {
        if c.state == .ended {
            let center = c.location(in: view)
            //findCircledView(center)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}

