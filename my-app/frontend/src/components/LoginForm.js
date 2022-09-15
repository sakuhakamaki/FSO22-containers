import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
    <div>
      <h2>Log in to application:</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          Password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </div>
        <button id='loginButton' type='submit'>
          Login
        </button>
      </form>
    </div>
  )}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
}

export default LoginForm
