import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'The title of the post is required'],
    maxLength: 50
  },
  description: {
    type: String,
    required: [true, 'The description of the post is required'],
    maxLength: 200
  }
}, { timestamps: true })

PostSchema.pre('save', async function () {
  await mongoose.model('User').findByIdAndUpdate(this.author, { $push: { posts: this.id } }, { new: true })
})

export default mongoose.model('Post', PostSchema)