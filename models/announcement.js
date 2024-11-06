const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;