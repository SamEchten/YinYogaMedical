
const Podcast = require("../models/Video");

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
                    description: podcast.description
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
                    description: podcast.description
                    //thumbnailPath: video.thumbnailPath,
                    //videoPath: video.videoPath
                });
            }
            res.status(200).json(allPodcasts);
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err });
        }
    }
}