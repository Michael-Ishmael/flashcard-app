//
//  SettingsTableViewController.swift
//  flashcards
//
//  Created by Michael Ishmael on 29/09/2016.
//  Copyright © 2016 66Bytes. All rights reserved.
//

import UIKit

class SettingsTableViewController: UITableViewController {

    
    @IBOutlet weak var soundSwitch: UISwitch!
    @IBOutlet weak var speechSwitch: UISwitch!
    @IBOutlet weak var textSwitch: UISwitch!
    
    
    public var settings:AppSettings?
    public var eventHandler:IApplicationEventHandler?
    
    override func viewDidLoad() {

        super.viewDidLoad()

        /*
        if let settings = settings {
            soundSwitch.isOn = settings.SoundsOn
            speechSwitch.isOn = settings.SpeechOn
            textSwitch.isOn = settings.TextOn
        } else {
            soundSwitch.isOn = true
            speechSwitch.isOn = true
            textSwitch.isOn = false
        }
        */
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
        
        
    }
    
    @IBAction func dismissSettings(_ sender: AnyObject) {
        self.dismiss(animated: true);
    }

    @IBAction func settingSwitched(_ sender: UISwitch) {

        if var settings = settings {
            if sender == soundSwitch {
                settings.SoundsOn = sender.isOn
            }
            if sender == speechSwitch {
                settings.SpeechOn = sender.isOn
            }
            if sender == textSwitch {
                settings.TextOn = sender.isOn
            }
        }
        notifySettingsChanged()
        
    }
    

    internal func notifySettingsChanged(){
        if let eventHandler = eventHandler, let settings = settings {
            eventHandler.settingsChanged(settings: settings)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source
    /*
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 0
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 0
    }
    */
    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
