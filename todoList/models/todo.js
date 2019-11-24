const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    done: {
        type: String,
        required: true
    }
});

let Todo = module.exports = mongoose.model('Todo', TodoSchema);