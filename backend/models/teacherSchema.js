// const mongoose = require("mongoose")

// const teacherSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: "Teacher"
//     },
//     school: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'admin',
//         required: true,
//     },
//     teachSubject: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'subject',
//     },
//     teachSclass: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'sclass',
//         required: true,
//     },
//     attendance: [{
//         date: {
//             type: Date,
//             required: true
//         },
//         presentCount: {
//             type: String,
//         },
//         absentCount: {
//             type: String,
//         }
//     }]
// }, { timestamps: true });

// module.exports = mongoose.model("teacher", teacherSchema)

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Teacher",
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    attendance: [{
        date: {
            type: Date,
            required: true,
        },
        presentCount: {
            type: String,
        },
        absentCount: {
            type: String,
        },
    }],
    // Add the location field
    location: {
        latitude: { type: Number, default: 1000 }, // default large value
        longitude: { type: Number, default: 1000 }, // default large value
    },
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema);
