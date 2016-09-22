//: Playground - noun: a place where people can play

import UIKit
import SQLite
import Foundation

var str = "Hello, playground"

func openDatabase() -> COpaquePointer {
    var db: COpaquePointer = nil
    if sqlite3_open(part1DbPath, &db) == SQLITE_OK {
        print("Successfully opened connection to database at \(part1DbPath)")
        return db
    } else {
        print("Unable to open database. Verify that you created the directory described " +
            "in the Getting Started section.")
        XCPlaygroundPage.currentPage.finishExecution()
    }
}
