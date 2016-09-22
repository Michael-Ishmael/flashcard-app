//: Playground - noun: a place where people can play

import UIKit
import GRDB

var str = "Hello, playground"


do {
    let dbPool = try DatabasePool(path: "/Users/scorpio/Dev/Projects/flashcard-app/xcode/flashcards/flashcards/db.sqlite3")
    
    try dbPool.read({ db in
        for row in Row.fetch(db, "SELECT * FROM card") {
            let name: String = row.value(named: "name")
            print(name)
        }
    })
    
} catch let ex {
    print(ex)
}
