const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router()
const mongoose = require('mongoose')
const fs = require('fs');
const authUser = require('../middleware/authUser')

router.get('/upload', authUser, async (req, res) => {
    try
    {
        res.status(200)
    }
    catch(err)
    {
        res.status(400).json({message:err.message})
    }
})

router.post('/upload/:type', authUser, async (req, res) => {
    let uploadedFile;
    let uploadPath;
    let folder;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    uploadedFile = req.files.uploadedFile;
    console.log(uploadedFile)
    console.log(req.params.type)
    if (req.params.type == 'problem') {
        folder = 'problems/'
    } else if (req.params.type == 'algorithm') {
        folder = 'algos/'
    }
    uploadPath = __dirname + '/../files/' + folder + uploadedFile.name;

    // Use the mv() method to place the file somewhere on your server
    uploadedFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send({
            message: 'File uploaded!',
            location: uploadPath,
            fileName: uploadedFile.name
        });
    });
});

router.get('/files/:type', authUser, async (req, res) => {
    const directoryPath = __dirname + "/../files/" + req.params.type + '/';
    const baseURL = 'http://localhost:5000/files/get/'+req.params.type+'/';

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                function: file.substring(0, file.indexOf('.')),
                url: baseURL + file,
            });
        });

        res.status(200).send(fileInfos);
    });
})

router.get('/files/get/:type/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    const directoryPath = __dirname + "/../files/" + req.params.type + '/';

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
})

module.exports = router