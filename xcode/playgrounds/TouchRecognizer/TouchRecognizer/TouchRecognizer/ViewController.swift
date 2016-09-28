//
//  ViewController.swift
//  TouchRecognizer
//
//  Created by Michael Ishmael on 28/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var pathDrawer: PathDrawer!
    @IBOutlet weak var statusLabel: UILabel!
    var zigzagRecognizer: ZigZagRecognizer!

    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        zigzagRecognizer = ZigZagRecognizer(target: self, action: #selector(self.zigZagDrawn(c:)))
        view.addGestureRecognizer(zigzagRecognizer)

        
    }
    
    func zigZagDrawn(c: ZigZagRecognizer) {
        if c.state == .began {
            pathDrawer.clear()
        }
        else if c.state == .changed {
            pathDrawer.updatePath(p: c.path)
        } else if c.state == .ended {
            statusLabel.text = "MATCH!"
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "HelpVc") as! HelpViewController
            present(vc, animated: true, completion: nil)
        } else {
            statusLabel.text = "Fail :-("
        }
    }
    
    @IBAction func returned(segue: UIStoryboardSegue) {
        statusLabel.text = "Returned"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}

