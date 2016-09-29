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
        zigzagRecognizer.delegate = self
        view.addGestureRecognizer(zigzagRecognizer)

        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let destination = segue.destination as! HelpTableViewController
        destination.soundSetting = true
    }
    
    
    @IBAction func TestWorks(_ sender: UIButton) {
        sender.titleLabel?.text = "Works!"
    }
    
    func zigZagDrawn(c: ZigZagRecognizer) {
        if c.state == .began {
            pathDrawer.clear()
        }
        else if c.state == .changed {
            pathDrawer.updatePath(p: c.path)
        } else if c.state == .ended {
            statusLabel.text = "MATCH!"
            performSegue(withIdentifier: "showSettings", sender: self)
//            present(vc, animated: true, completion: nil)
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

extension ViewController: UIGestureRecognizerDelegate {
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        return !(touch.view is UIButton)
    }
    
}

