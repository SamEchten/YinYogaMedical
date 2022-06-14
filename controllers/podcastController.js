const Podcast = require("../models/Podcast");
const fs = require("fs");
const path = require("path");

module.exports.streamFile = async (req, res) => {
    const fileName = req.params.fileName;
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    // get video stats (about 61MB)
    try {
        const podcastPath = path.join(__dirname, "../media/podcasts/" + fileName);
        const podcastSize = fs.statSync(path.join(__dirname, "../media/podcasts/" + fileName)).size;
        //console.log(videoPath)
        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, podcastSize - 1);
        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${podcastSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "audio/mpeg",
        };
        res.writeHead(206, headers);
        // create video read stream for this particular chunk
        const podcastStream = fs.createReadStream(podcastPath, { start, end });

        // Stream the video chunk to the client
        podcastStream.pipe(res);

    } catch (err) {
        console.log(err);
    }
};

module.exports.get = async (req, res) => {
    const { id } = req.params;

    //Get single user by given Id ->
    if (id) {
        try {
            let podcast = await Podcast.findOne({ _id: id });
            if (podcast) {
                res.status(200).json({
                    title: podcast.title,
                    price: podcast.price,
                    description: podcast.description,
                    thumbnailPath: podcast.thumbnailPath,
                    podcastPath: podcast.podcastPath
                });
            } else {
                res.status(404).json({ message: "Geen podcast gevonden met dit id" });
            }
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err.message });
        }
    } else {
        //Get all podcasts ->
        try {
            let podcasts = await Podcast.find();
            let allPodcasts = [];
            for (podcastIndex in podcasts) {
                let podcast = podcasts[podcastIndex];
                allPodcasts.push({
                    id: podcast._id,
                    title: podcast.title,
                    price: podcast.price,
                    description: podcast.description,
                    thumbnailPath: podcast.thumbnailPath,
                    podcastPath: podcast.podcastPath
                });
            }
            res.status(200).json(allPodcasts);
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err });
        }
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const thumbnailPathServer = path.join(__dirname,"../public/images/thumbnails/");
    const podcastPathServer = path.join(__dirname,"../media/podcasts/");

    try {
        let podcast = await Podcast.findOne({_id : id});
        if(podcast){
            podcast.remove();
            try {
                let thumbnailPath = thumbnailPathServer + podcast.thumbnailPath;
                let podcastPath = podcastPathServer + podcast.podcastPath;
                fs.unlink(thumbnailPath, function(err) {
                    if(err && err.code == "ENOENT") {
                        res.status(400).json({message: "File does not exist"});
                    }else {
                        console.log("Thumbnail removed");
                    }
                });
                fs.unlink(podcastPath, function(err) {
                    if(err && err.code == "ENOENT") {
                        res.status(400).json({message: "File does not exist"});
                    }else {
                        console.log("video removed");
                    }
                });
                res.status(200).json({message: "Video verwijderd"});

            } catch(err) {
                res.status(400).send(err);
            }
        } else {
            res.status(400).json({message: "Podcast met opgegeven ID niet gevonden"});
        }
    } catch (err) {
        res.status(400).json({message: "Gegeven ID niet correct ID format"});
    }
}

module.exports.update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        Podcast.findOne({ _id: id }, async (err, product) => {
            if (product) {
                await Podcast.updateOne({ _id: id }, { $set: body });
                res.status(200).json({message: "Podcast gewijzigd"});
            } else {
                res.status(404).json({ message: "Er is geen Podcast gevonden met dit id" });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

// Render podcat page
module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/podcast"), { isAdmin: false });
}