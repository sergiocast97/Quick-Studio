// Requiring necessary modules
const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const Project = require('../model/project')
const Track = require('../model/project')
const Recording = require('../model/project')

// Initialize Multer
//const recordingMimeType = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    // Destination Folder
    dest: path.join('public', Project.recordingBasePath),
    // Filter File Types
    //fileFilter: (req, file, callback) => { callback(null, recordingMimeType.includes(file.mimetype)) }
})

/* Update Project Name */
router.post('/:project_id/project_name', async function(req, res) {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Get the passed Object
        let passed_data = req.body
        let new_name = ( passed_data.name == "" ? project.name : passed_data.name)

        // Update the name and Last Modified Date
        project.name = new_name
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Project Name updated successfully", project_name: saved_project.name });
        console.log("Project Name updated successfully \n")

    } catch(error) {

        console.log("Project could not be updated: " + error + "\n")
        res.send({ message: "Project could not be renamed"});
    }
})

/* Add a new Track */
router.post('/:project_id/add_track/', async function(req, res) {
    try {
        // Get the existing Project
        await Project.findOne({ project_id: req.params.project_id },  async function (err, project) {

            // Get the colours
            let colours = [ "purple", "red", "orange", "yellow", "green", "blue"]
            let colour = colours[Math.floor(Math.random() * colours.length)];

            // Create a new Track
            const track = {
                track_id: randomString(10),
                track_name: req.body.track_name,
                track_colour: colour
            }

            // Push to the Project
            project.tracks.push(track)
            project.last_modified_date = Date.now()

            // Save the project details
            await project.save()
            
            // Redirect to the settings page
            res.send({
                message: "Track Added Successfully",
                track_id: track.track_id,
                track_name: track.track_name,
                track_colour: track.track_colour
            })
            console.log("Track Added Successfully \n")
        })
    } catch(error) {

        console.log("Track could not be added: " + error + "\n")
    }
})

/* Update Track Name */
router.post('/:project_id/track_name', async function(req, res) {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Get the passed Object
        let passed_data = req.body
        let track_id = passed_data.track_id
        let new_name = ( passed_data.name == "" ? project.tracks.find(obj => obj.track_id == track_id).track_name : passed_data.name)

        // Update the track name and Last Modified Date
        project.tracks.find(obj => obj.track_id == track_id).track_name = new_name
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Track Name updated successfully", track_name: saved_project.tracks.find(obj => obj.track_id == track_id).track_name });
        console.log("Track Name updated successfully \n")

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

        // Get the passed Object
        let passed_data = req.body
        let track_id = passed_data.track_id
        let new_colour = passed_data.track_colour

        // Update the track name and Last Modified Date
        project.tracks.find(obj => obj.track_id == track_id).track_colour = new_colour
        project.last_modified_date = Date.now()

        // Save and send new details
        const saved_project = await project.save()
        res.send({ message: "Track Colour updated successfully", new_colour: saved_project.tracks.find(obj => obj.track_id == track_id).track_colour });
        console.log("Track Colour updated successfully \n")

    } catch(error) {

        console.log("Track Colour could not be updated: " + error + "\n")
        res.send({ message: "Track Colour could not be renamed"});
    }
})

/* Add a new Recording */
router.post('/:project_id/add_recording/', upload.single('recording') ,async function(req, res) {
    try {
        await Project.findOne({ project_id: req.params.project_id }, async function (err, project) {
        
            // Inside the project, find the track
            const track = project.tracks.filter( track => {
                return track.track_id === req.body.track_id
            }).pop()

            // Create a new recording and add it
            const recording = {
                recording_id: randomString(5),
                start_second: req.body.start_second,
                audio: req.file.path
            }

            // Push recording to the track
            track.recordings.push(recording)

            // Save Project
            await project.save()

            // Response
            console.log("Recording Added Successfully \n")
            res.send({ message: "Track Added Successfully", recording_id: recording.recording_id,  start_second: recording.start_second })

        })
    } catch(error) {

        console.log("Recording could not be added: " + error + "\n")
    }
})

/* Delete a Project */
router.delete('/:project_id/delete_project', async (req, res) => {
    try {

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Remove the Project
        removedProject = await project.remove()
        console.log("Project removed successfully \n")
        res.send({ message: "Project removed Successfully" })

    } catch(error) {

        console.log(error + "\n")
        res.send({ message: "Project could not be deleted"});
    }
})

/* Delete a Track */
router.delete('/:project_id/delete_track', async (req, res) => {
    try {
        await Project.findOne({ project_id: req.params.project_id }, async function (err, project) {

            // Find the track
            let track = project.tracks.filter( track => {
                return track.track_id === req.body.track_id
            })

            // Delete the track
            project.tracks.splice(track, 1)

            // Update Database
            await project.save()
            console.log("Track Removed successfully \n")
            res.send({ message: "Track removed Successfully" })
        })
    } catch (error) {

        console.log(error + "\n")
        res.send({ message: "Track could not be deleted"});
    }
})

/* Delete Recording */
router.delete('/:project_id/delete_recording', async (req, res) => {
    try {
        await Project.findOne({ project_id: req.params.project_id }, async function (err, project) {
        
            // Find track
            let track = project.tracks.filter( track => {
                return track.track_id === req.body.track_id
            })

            // Find recording and delete it
            track.recordings.filter( recording => {
                return recording.recording_id === req.body.recording_id
            }).pop()

            // Save Project
            await project.save()

            // Response
            console.log("Recording Deleted Successfully \n")
            res.send({ message: "Recording deleted Successfully"})
        })
    } catch (error) {

        console.log(error + "\n")
        res.send({ message: "Track could not be deleted"});
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