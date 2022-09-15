import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Tapahtumankäsittelijä <Create>-napin painallukselle.
  const addBlog = (event) => {
    event.preventDefault()

    // Välitetään blogin tiedot parametrina saadulle
    // tapahtumankäsittelijälle.
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <div>
    <h2>Create new blog:</h2>
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          id='title'
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
          placeholder='Example title'
          required
        />
      </div>
      <div>
        Author:
        <input
          id='author'
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='Example author'
          required
        />
      </div>
      <div>
        Url:
        <input
          id='url'
          type='url'
          value={url}
          name='Url'
          onChange={({ target }) => setUrl(target.value)}
          placeholder='Example Url'
          required
        />
      </div>
      <button id='createButton' type='submit'>
        Create
      </button>
    </form>
  </div>
}

export default BlogForm