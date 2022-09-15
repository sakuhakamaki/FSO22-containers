const listHelper = require('../utils/list_helper')

const listOfBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

test('Dummy returns one.', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('Total likes', () => {

    test('of an empty list is zero.', () => {
        const blogs = []
        
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('when the list has only one blog, equals the likes of that blog.', () => {
        const blogs = [listOfBlogs[0]]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(blogs[0].likes)
    })

    test('of a bigger list is calculated right.', () => {
        const result = listHelper.totalLikes(listOfBlogs)
        expect(result).toBe(36)
    })
})

describe('Favorite blog', () => {

    test('of an empty list is zero.', () => {
        const blogs = []
        
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toBe(0)
    })

    test('when the list has only one blog, equals that blog itself.', () => {
        const blogs = [listOfBlogs[0]]

        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[0])
    })

    test('of a bigger list, equals the blog with most likes.', () => {
        const result = listHelper.favoriteBlog(listOfBlogs)
        expect(result).toEqual(listOfBlogs[2])
    })
})

describe('Most blogs', () => {

    test('of an empty list is zero.', () => {
        const blogs = []
        
        const result = listHelper.mostBlogs(blogs)
        expect(result).toBe(0)
    })

    test('when the list has only one blog, equals the author of that blog.', () => {
        const blogs = [listOfBlogs[0]]

        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(
            {
                author: blogs[0].author,
                blogs: 1
            }
        )
    })

    test('in a bigger list, has the author with most blogs.', () => {
        const result = listHelper.mostBlogs(listOfBlogs)
        expect(result).toEqual(
            {
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })
})

describe('Most likes', () => {

    test('of an empty list is zero.', () => {
        const blogs = []
        
        const result = listHelper.mostLikes(blogs)
        expect(result).toBe(0)
    })

    test('when the list has only one blog, equals the author of that blog.', () => {
        const blogs = [listOfBlogs[0]]

        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(
            {
                author: blogs[0].author,
                likes: blogs[0].likes
            }
        )
    })

    test('in a bigger list, equals the author with most likes.', () => {
        const result = listHelper.mostLikes(listOfBlogs)
        expect(result).toEqual(
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })
})