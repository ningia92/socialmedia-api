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

// before save the post add the post reference to the user posts
PostSchema.pre('save', async function () {
  await mongoose.model('User').findByIdAndUpdate(this.author, { $push: { posts: this._id } }, { new: true })
})

// before delete the post remove the post reference from the user posts
// The options { document: true, query: false } are used to make the middleware behave like document middleware, since
// deleteOne is executed as query middleware by default. In this context, "this" would not represent the document but the
// query itself, so you would not have access to the document properties (this.author, this._id)
PostSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('User').findByIdAndUpdate(this.author, { $pull: { posts: this._id } }, { new: true })
})

export default mongoose.model('Post', PostSchema)