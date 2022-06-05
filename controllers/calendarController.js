const Nylas = require("nylas");
const { default: Event } = require('nylas/lib/models/event');

const CLIENT_ID = "jJx3SsfMOsny5P8VQ14CTb4SN20HGt"
const CLIENT_SECRET = "jJx3SsfMOsny5P8VQ14CTb4SN20HGt"
const ACCESTOKEN = "jJx3SsfMOsny5P8VQ14CTb4SN20HGt"
const CALENDAR_ID = "1ia57y4kct9d7w92ztlz3cxqa"

Nylas.config({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const nylas = Nylas.with(ACCESTOKEN);

module.exports.createEvent = async (title, location, description, startTime, endTime, id) => {
    const event = new Event(nylas, {
        title: title,
        location: location,
        description: description,
        when: { startTime: startTime, endTime: endTime },
        calendarId: CALENDAR_ID
    });

    await event.save();
    return event.id;
}

module.exports.deleteEvent = async (id) => {
    try {
        nylas.events.delete(id.toString());
    } catch (err) {

    }
}

module.exports.updateEvent = async (id, newEvent) => {
    nylas.events.find(id.toString()).then(event => {
        event.title = newEvent.title;
        event.location = newEvent.location;
        event.description = newEvent.description;
        event.when.startTime = newEvent.when.startTime;
        event.when.endTime = newEvent.when.endTime;
        event.save();
    });
}