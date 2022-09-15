const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedBlog) => {
    returnedBlog.id = returnedBlog._id.toString()
    delete returnedBlog._id
    delete returnedBlog.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog