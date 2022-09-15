import { useState, useEffect, useRef } from 'react'

// Hyödynnettävät palvelut.
import blogService from './services/blogs'
import loginService from './services/login'

// HYödynnettävät komponentit.
import Blog from './components/Blog'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Viite BlogForm-komponenttiin.
  const blogFormRef = useRef()

  // Alustetaan blogit ruudulle.
  useEffect(() => {
    renderBlogs()
  }, [])

  // Alustetaan käyttäjän istunto, jos
  // käyttäjä löytyy edelleen selaimen localStoragesta.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Vastaa blogien päivittämisestä ruudulle lajiteltuna
  // blogien tykkäysten mukaiseen laskevaan järjestykseen.
  const renderBlogs = async () => {
    const response = await blogService.getAll()

    setBlogs(response.sort((blog1, blog2) => blog2.likes - blog1.likes))
  }

  // Uuden blogin lisäämisestä huolehtiva tapahtumankäsittelijä.
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .createNew(blogObject)
      .then(returnedBlog => {
        renderBlogs()
        setBlogs(blogs.concat(returnedBlog))
      })

    renderBlogs()

    setSuccessMessage(`Added a new blog ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  // Tykkäyksen lisäämisestä blogille vastaava tapahtumankäsittelijä.
  const addLike = async (id, blogObject) => {
    await blogService.updateOld(id, blogObject)

    renderBlogs()

    setSuccessMessage(`Added a like to blog ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  // Tarkastaa kuuluuko parametrina saatua blogin id:tä vastaava blogi
  // kirjautuneen käyttäjän luomiin blogeihin. Palauttaa <true> jos
  // kuuluu ja <false> jos ei kuulu.
  const isBlogCreatedByLoggedUser = (blogId) => {
    const currentBlog = blogs.find(({ id }) => id === blogId)

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const loggedUser = JSON.parse(loggedUserJSON)

    if (currentBlog.user.username === loggedUser.username) {
      return true
    }
    return false
  }

  // Blogin poistamisesta vastuussa oleva tapahtumankäsittelijä.
  const removeBlog = async (blogId) => {
    const blog = blogs.find(({ id }) => id === blogId)

    const confirmMessage = `Remove blog ${blog.title} by ${blog.author}?`

    if (window.confirm(confirmMessage)) {
      await blogService.remove(blogId)

      renderBlogs()

      setSuccessMessage(`Blog ${blog.title} by ${blog.author} removed successfully.`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }

  // Tapahtumankäsittelijä, joka huolehtii käyttäjän sisäänkirjautumisesta.
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setSuccessMessage('Logged in successfully.')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage('Wrong username or password.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Käyttäjän uloskirjaamisesta vastuussa oleva tapahtumankäsittelijä.
  const handleLogout = (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogAppUser')
    }
    catch (exception) {
      console.log('An error occurred while trying to log out.')
    }
  }

  // Palauttaa kutsuttaessa kirjautumislomake-komponentin.
  const loginForm = () => (
    <LoginForm handleSubmit={handleLogin} username={username}
      setUsername={setUsername} password={password} setPassword={setPassword}
    />
  )

  // Komponentti, joka näyttää sisäänkirjautuneen
  // käyttäjän nimen ja uloskirjaamispainikkeen.
  const loggedInElement = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const name = JSON.parse(loggedUserJSON).name

    return (
      <div>
        <p>Logged in as {name}.</p>
        <button id='logoutButton' onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  // Palauttaa kutsuttaessa bloginluomis-komponentin.
  const blogForm = () => (
    <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  // Palauttaa kutsuttaessa komponentin, joka sisältää listan tietokannassa olevista blogeista.
  const bloglistElement = () => (
    <div id='blogList'>
      <h2>Blogs in database:</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={addLike}
          checkCorrectUser={isBlogCreatedByLoggedUser} remove={removeBlog}
        />
      )}
    </div>
  )

  return (
    <div>
      <h1>Blogs-application</h1>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      {user === null && loginForm()}
      {user !== null && loggedInElement()}
      {user !== null && blogForm()}
      {user !== null && bloglistElement()}

    </div>
  )
}

export default App
