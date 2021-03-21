// Requiring necessary modules
const express = require('express')
const router = express.Router()
const Project = require('../model/project')

/* Update Project Name */
router.post('/:project_id/project_name', async function(req, res) {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })
        console.log(`Project: ${ project.name } (${ project.project_id })`)

        // Get the passed Object
        let passed_data = req.body
        let new_name = passed_data.name

        // Update the name and Last Modified Date
        project.name = new_name
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Project Name updated successfully", project_name: saved_project.name });
        console.log("Project Name updated successfully")

    } catch(error) {

        console.log("Project could not be updated: " + error + "\n")
        res.send({ message: "Project could not be renamed"});
    }
})

/* Add a new Track */
router.post('/:project_id/add_track/', async function(req, res) {
    try {

        // Get the existing Project
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Get the passed Object
        let passed_data = req.body

        // Get the colours
        let colours = [ "purple", "red", "orange", "yellow", "green", "blue"]
        let colour = colours[Math.floor(Math.random() * colours.length)];

        // Create a new Track
        let new_track = {
            track_id: randomString(10),
            track_name: passed_data.track_name,
            track_colour: colour,
            recordings: []
        }

        // Push to the Project
        project.tracks.push(new_track)
        project.last_modified_date = Date.now()

        // Save the project details
        const saved_project = await project.save()
        
        // Redirect to the settings page
        res.send({
            message: "Track Added Successfully",
            track_id: new_track.track_id,
            track_name: new_track.track_name,
            track_colour: new_track.track_colour
        });
        console.log("Track Added Successfully")

    } catch(error) {

        console.log("Track could not be added: " + error + "\n")
    }
})

/* Update Track Name */
router.post('/:project_id/track_name', async function(req, res) {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })
        console.log(`Project: ${ project.name } (${ project.project_id })`)

        // Get the passed Object
        let passed_data = req.body
        let track_id = passed_data.track_id
        let new_name = passed_data.name

        // Update the track name and Last Modified Date
        project.tracks.find(obj => obj.track_id == track_id).track_name = new_name
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Track Name updated successfully", track_name: saved_project.tracks.find(obj => obj.track_id == track_id).track_name });
        console.log("Track Name updated successfully")

    } catch(error) {

        console.log("Track name could not be updated: " + error + "\n")
        res.send({ message: "Track name could not be renamed"});
    }
})

/* Update Track Colour */
router.post('/:project_id/track_colour', async function(req, res) {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })
        console.log(`Project: ${ project.name } (${ project.project_id })`)

        // Get the passed Object
        let passed_data = req.body
        let track_id = passed_data.track_id
        let new_colour = passed_data.track_colour
        console.log(`Track ID ${ track_id }, Colour: ${ new_colour }`)

        // Update the track name and Last Modified Date
        project.tracks.find(obj => obj.track_id == track_id).track_colour = new_colour
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Track Colour updated successfully", new_colour: saved_project.tracks.find(obj => obj.track_id == track_id).track_colour });
        console.log("Track Colour updated successfully")

    } catch(error) {

        console.log("Track Colour could not be updated: " + error + "\n")
        res.send({ message: "Track Colour could not be renamed"});
    }
})

/* Delete a Project */
router.delete('/:project_id/delete', async (req, res) => {
    try {

        // Find the project on the database
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Remove user
        removedProject = await project.remove()
        console.log("Project removed")

        // Redirect to Main Page
        res.redirect('/')

    } catch {

        // Redirect to Main Page
        res.redirect('/')
    }
})

// Function to generate random string
function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Export the Router
module.exports = router