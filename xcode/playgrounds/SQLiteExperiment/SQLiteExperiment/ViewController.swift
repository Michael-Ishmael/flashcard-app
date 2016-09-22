//
//  ViewController.swift
//  SQLiteExperiment
//
//  Created by Michael Ishmael on 22/09/2016.
//  Copyright © 2016 Michael Ishmael. All rights reserved.
//

import UIKit
import GRDB

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        do {
            let dbQueue = try DatabaseQueue(path: "/Users/scorpio/Dev/Projects/flashcard-app/xcode/flashcards/flashcards/flashcards.db")
            
            try dbQueue.inDatabase({ db in
                for row in Row.fetch(db, "SELECT * FROM card") {
                    let name: String = row.value(named: "name")
                    print(name)
                }
            })
            
        } catch let ex {
            print(ex)
        }
        
        


    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

