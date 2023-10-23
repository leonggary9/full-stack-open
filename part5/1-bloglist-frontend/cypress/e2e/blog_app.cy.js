Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    window.localStorage.setItem('loggedInUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem('loggedInUser')).token}`
    }
  })
  cy.visit('')
})

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'test name',
      username: 'testUsername',
      password: 'password'
    }
    const otherUser = {
      name: 'test other name',
      username: 'testOtherUsername',
      password: 'password'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, otherUser)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#login-form')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUsername')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('test name is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUsername')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'test name is logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUsername', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('.titleInput').type('test title')
      cy.get('.authorInput').type('test author')
      cy.get('.urlInput').type('www.testurl.com')
      cy.get('.submitFormButton').click()

      cy.contains('test title - test author')
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'default blog 1', author: 'default author 1', url: 'www.defaultblog.com' })
        cy.createBlog({ title: 'default blog 2', author: 'default author 2', url: 'www.defaultblog.com' })
        cy.createBlog({ title: 'default blog 3', author: 'default author 3', url: 'www.defaultblog.com' })
      })

      it('User can like a blog', function() {
        cy.contains('default blog 1 - default author 1').parent().as('targetBlog')
        cy.get('@targetBlog').find('.showDetailsButton').click()
        cy.get('@targetBlog').find('.likes').should('contain', 'likes 0')
        cy.get('@targetBlog').find('.likeButton').click()
        cy.get('@targetBlog').find('.likes').should('contain', 'likes 1')
      })

      it('User who created a blog can delete it', function() {
        cy.contains('default blog 1 - default author 1').parent().as('targetBlog')
        cy.get('@targetBlog').find('.showDetailsButton').click()
        cy.get('@targetBlog').find('.deleteButton').click()
        cy.get('html').should('not.contain', 'default blog 1 - default author 1')
      })

      it('User who did not create the blog cannot delete it', function() {
        cy.get('#logout-button').click()
        cy.login({ username: 'testOtherUsername', password: 'password' })
        cy.contains('default blog 1 - default author 1').parent().as('targetBlog')
        cy.get('@targetBlog').find('.showDetailsButton').click()
        cy.get('@targetBlog').find('.deleteButton').should('not.exist')
      })

      it('Blogs are ordered according to likes with the most likes being first', function() {
        cy.contains('default blog 1 - default author 1').parent().as('blog1')
        cy.contains('default blog 2 - default author 2').parent().as('blog2')
        cy.contains('default blog 3 - default author 3').parent().as('blog3')
        cy.get('@blog2').find('.showDetailsButton').click()
        cy.get('@blog2').find('.likeButton').click()
        cy.get('@blog2').find('.likes').should('contain', 'likes 1')
        cy.get('@blog2').find('.likeButton').click()
        cy.get('@blog2').find('.likeButton').click()
        cy.get('@blog3').find('.showDetailsButton').click()
        cy.get('@blog3').find('.likeButton').click()
        cy.get('@blog3').find('.likes').should('contain', 'likes 1')
        cy.get('@blog3').find('.likeButton').click()
        cy.get('@blog3').find('.likes').should('contain', 'likes 2')
        cy.get('@blog3').find('.likeButton').click()

        cy.get('.blog').eq(0).should('contain', 'default blog 3 - default author 3')
        cy.get('.blog').eq(1).should('contain', 'default blog 2 - default author 2')
        cy.get('.blog').eq(2).should('contain', 'default blog 1 - default author 1')
      })
    })
  })
})