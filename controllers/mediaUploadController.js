const formidable = require("formidable");
const fs = require('fs');
const path = require("path");
const Video = require("../models/Video");
const Podcast = require("../models/Podcast");
const { compareSync } = require("bcryptjs");

module.exports.upload = async (req, res) => {
    //Er moet hier nog een checkje dat je wel een admin bent
    const thumbnailUploadPath = path.join(__dirname, "../public/thumbnails/");
    const videoUploadPath = path.join(__dirname, "../videos/");
    const podcastUploadPath = path.join(__dirname, "../podcasts/");
    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.maxFileSize = 100 * 1024 * 1024;
        
    form.parse(req, async (err, fields, files) => {
        if(err) {
            res.status(400).json({message: "Bestand te groot om te uploaden"});
        }else {
            const title = fields.title;
            const price = fields.price;
            const description = fields.description;
            const thumbnail = files.thumbnail;
            const media = files.media;
            const parsePrice = parseInt(price);
            
            // check if inputfields are filled in ->
            if(title != "" && price != "" && description != "") {
                // check if price is a integer ->
                if(!isNaN(parsePrice)) {
                    if(thumbnail.size != 0 && media.size != 0) {
                        // check if file is podcast or video ->
                        if(media.mimetype == "audio/mpeg") {
                            // save in podcasts
                                const thumbnailFileName = encodeURIComponent(createUniqueFileName(thumbnail.originalFilename).replace(/\s/g, "-"));
                                const podcastFileName = encodeURIComponent(createUniqueFileName(media.originalFilename).replace(/\s/g, "-"));
                                // write thumbnail file to the thumbnail folder ->
                                try {
                                    fs.renameSync(thumbnail.filepath, path.join(thumbnailUploadPath, thumbnailFileName));
                                    fs.renameSync(media.filepath, path.join(podcastUploadPath, podcastFileName));
                                } catch(err) {
                                    console.log(err)
                                    res.status(400).json({message : "Bestanden niet correct geupload vraag de beheerder voor meer informatie"});
                                }
                                // write podcast and thumbnail to the database ->
                                try {
                                    const podcast = await Podcast.create({
                                        title : title,
                                        price : convertPrice(price),
                                        desciption : description,
                                        thumbnailPath : thumbnailFileName,
                                        podcastPath : podcastFileName
                                    });

                                    res.status(200).json({message : "Podcast geupload!"});

                                } catch (err) {
                                    console.log(err)
                                    res.status(400).send(err);
                                }   
                        } else {
                            if(checkMimeType(thumbnail, media)){
                                const thumbnailFileName = encodeURIComponent(createUniqueFileName(thumbnail.originalFilename).replace(/\s/g, "-"));
                                const videoFileName = encodeURIComponent(createUniqueFileName(media.originalFilename).replace(/\s/g, "-"));
                                // write thumbnail file to the thumbnail folder ->
                                try {
                                    fs.renameSync(thumbnail.filepath, path.join(thumbnailUploadPath, thumbnailFileName));
                                    fs.renameSync(media.filepath, path.join(videoUploadPath, videoFileName));
                                } catch(err) {
                                    console.log(err)
                                    res.status(400).json({message : "Bestanden niet correct geupload vraag de beheerder voor meer informatie"});
                                }
                                
                                // write video and thumbnail to the database ->
                                try {
                                    const vid = await Video.create({
                                        title : title,
                                        price : convertPrice(price),
                                        description : description,
                                        thumbnailPath : thumbnailFileName,
                                        videoPath : videoFileName
                                    });

                                    res.status(200).json({message : "video geupload!"});

                                } catch (err) {
                                    console.log(err)
                                    res.status(400).send(err);
                                }   

                            } else {
                                res.status(400).json({message : "De thumbnail moet de volgende extentie bevatten: jpg, jpeg, png. Video moet de extentie mp4 hebben."});
                            }
                        }                      
                    } else {
                        res.status(400).json({message : "Geen video of thumbnail geupload"})
                    }
                } else {
                    res.status(400).json({message : "Prijs moet een getal zijn"});
                }
            } else {
                res.status(400).json({message : "Vul alle velden in voordat u een video aanmaakt"});
            }
        }
        
    });
};

function checkMimeType(thumbnail, video) {
    if(thumbnail.mimetype != "image/jpeg" && thumbnail.mimetype != "image/png" && thumbnail.mimetype != "image/jpg") {
        return false;
    }
    if(video.mimetype != "video/mp4") {
        return false;
    }
    return true
}
function createUniqueFileName (media) {
    const unix = Math.round((new Date()).getTime() / 1000);
    const fileName = unix.toString().concat(media);
    return fileName;
}
// Convert price(String) to valid price string
const convertPrice = (price) => {
    const length = price.length;
    price = price.toString();
    if (length != 5) {
        if (!price.includes(".")) {
            price += ".00";
        } else {
            const num = price.split(".")[0];
            const decimals = price.split(".")[1];
            if (decimals.length != 2) {
                price = num + "." + "" + decimals[0] + "" + decimals[1];
            }
        }
    }

    return price;
}