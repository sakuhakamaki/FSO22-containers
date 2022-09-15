describe('Blog app', function () {
  beforeEach(function() {
    // Nollataan tietokanta.
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // Luodaan kaksi testikäyttäjää.
    const user = {
      name: 'E2E Tester',
      username: 'e2etester',
      password: 'securePassword'
    }
    const anotherUser = {
      name: 'E2E Helper',
      username: 'e2ehelper',
      password: 'alsoSecurePassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', anotherUser)

    // Palataan aloitussivulle.
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown.', function() {
    cy.contains('Blogs-application')
    cy.contains('Log in to application:')
  })

  describe('Login', function() {
    it('succeeds with correct credentials.', function() {
      cy.get('#username').type('e2etester')
      cy.get('#password').type('securePassword')
      cy.get('#loginButton').click()

      cy.contains('Logged in as E2E Tester.')
    })

    it('fails with wrong credentials.', function() {
      cy.get('#username').type('e2etester')
      cy.get('#password').type('thisIsNotCorrect')
      cy.get('#loginButton').click()

      cy.get('.errorNotification').contains('Wrong username or password.')
      cy.get('.errorNotification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // Kirjaudutaan sisään sivulle.
      cy.login({ username: 'e2etester', password: 'securePassword' })
    })

    it('a blog can be created.', function() {
      cy.get('#togglableButton').click()

      cy.get('#title').type('Creating from Cypress.')
      cy.get('#author').type('Mr. Cypress')
      cy.get('#url').type('http://mrcypress.com/creating')
      cy.get('#createButton').click()

      cy.get('#blogList').contains('Creating from Cypress.')
      cy.get('.successNotification').contains(
        'Added a new blog Creating from Cypress. by Mr. Cypress.'
      )
      cy.get('.successNotification').should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    afterEach(function() {
      cy.get('#logoutButton').click()
    })
  })

  describe('When blogs exist', function() {
    beforeEach(function() {
      // Kirjaudutaan sisälle ja luodaan testiblogi.
      cy.login({ username: 'e2etester', password: 'securePassword' })
      cy.createBlog({
        title: 'Another Cypress Blog.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/another'
      })
    })

    it('a like can be added to one of the blogs.', function() {
      cy.contains('Another Cypress Blog.').get('#viewButton').click()

      cy.get('#likes').contains(0)
      cy.get('#likeButton').click()
      cy.get('#likes').contains(1)
    })

    it('a blog can be deleted by logged in user.', function() {
      cy.get('#blogList').contains('Another Cypress Blog.')
      cy.contains('Another Cypress Blog.').get('#viewButton').click()

      cy.get('#removeButton').click()
      cy.get('.titleAndAuthor').should('not.exist')
    })

    it('a blog can not be deleted by user who did not create the blog', function() {
      cy.get('#logoutButton').click()
      cy.visit('http://localhost:3000')
      cy.login({ username: 'e2ehelper', password: 'alsoSecurePassword' })

      cy.get('#blogList').contains('Another Cypress Blog.')
      cy.contains('Another Cypress Blog.').get('#viewButton').click()
      cy.get('#removeButton').should('not.be.visible')
    })

    it('blogs are in descending order by number of likes.', function() {
      // Luodaan vielä kaksi uutta testiblogia, nyt yhteensä 3 kpl.
      cy.createBlog({
        title: 'Creating from Cypress.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/creating'
      })
      cy.createBlog({
        title: 'Third Cypress Blog.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/third'
      })

      // Haetaan ensimmäisen blogin <view>-painike ja painetaan sitä.
      cy.contains('Creating from Cypress.').parent().find('button').as('firstButton')
      cy.get('@firstButton').click()

      // Haetaan avautuneen komponentin "lapsista" tykkäysnappi ja tallennetaan se aliakseen.
      cy.contains('Creating from Cypress.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('firstLikeButton')

      // Toimitaan samalla tavalla toisen blogin kanssa, painetaan <view>-painiketta ja
      // haetaan avautuneen komponentin sisältä tykkäyspainike.
      cy.contains('Another Cypress Blog.').parent().find('button').as('secondButton')
      cy.get('@secondButton').click()
      cy.contains('Another Cypress Blog.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('secondLikeButton')

      // Edelleen sama toimenpide kolmannelle blogille.
      cy.contains('Third Cypress Blog.').parent().find('button').as('thirdButton')
      cy.get('@thirdButton').click()
      cy.contains('Third Cypress Blog.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('thirdLikeButton')

      // Lisätään ensimmäiselle blogille kolme tykkäystä,
      // odotetaan vastauksen rekisteröitymistä kunkin
      // painalluksen jälkeen 250 millisekuntia.
      cy.get('@firstLikeButton').click()
      cy.wait(250)
      cy.get('@firstLikeButton').click()
      cy.wait(250)
      cy.get('@firstLikeButton').click()

      // Lisätään toiselle blogille kaksi tykkäystä,
      // ja odotetaan tykkäysten vastauksen rekisteröitymistä.
      cy.get('@secondLikeButton').click()
      cy.wait(250)
      cy.get('@secondLikeButton').click()

      // Lisätään niin ikään viimeiselle blogille tykkäys.
      cy.get('@thirdLikeButton').click()

      // Tarkastetaan, että sivulla ylimpänä eniten tykkäyksiä
      // saanut blogi. Lisäksi tarkastetaan tykkäysten oikeat määrät.
      cy.get('.blog').eq(0).contains('Creating from Cypress.')
      cy.get('.blog').eq(0).contains('likes 3')
      cy.get('.blog').eq(1).contains('Another Cypress Blog.')
      cy.get('.blog').eq(1).contains('likes 2')
      cy.get('.blog').eq(2).contains('Third Cypress Blog.')
      cy.get('.blog').eq(2).contains('likes 1')
    })
  })
})