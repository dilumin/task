import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    ph:{
        type: String,
        required: true,
    },
    q1: {
        type: String,
        required: true,
    },
    q2: {
        type: String,
        required: true,
    },
    q3: {
        type: String,
        required: true,
    },
    q4: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
        required: true,
    },
})

export default mongoose.models.Post || mongoose.model('Post', postSchema)