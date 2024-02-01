const supertest = require("supertest")
const app = require("../../../src/server.js")
const { createUser } = require("../../helpers/createUser.js")
const { createPost } = require("../../helpers/createPost.js")
const jwt = require('jsonwebtoken')

describe("Post Endpoint", () => {
    describe("POST /posts", () => {
        it("will create a new post", async () => {
            const user = await createUser('john', '123456')

            const request = {
                title: 'Hello, world!',
                userId: user.id
            }

            const response = await supertest(app)
                .post("/posts")
                .send(request)

            expect(response.status).toEqual(201)
            expect(response.body.post).not.toEqual(undefined)
            expect(response.body.post.id).not.toEqual(undefined)
            expect(response.body.post.title).toEqual(request.title)
            expect(response.body.post.userId).toEqual(request.userId)
        })

        it("will return 400 if one of the required fields is missing", async () => {
            const response = await supertest(app).post("/posts").send({})

            expect(response.status).toEqual(400)
            expect(response.body).toHaveProperty('error')
        })

        it("will return 409 when attemping to create a post for a user that does not exist", async () => {
            const request = {
                title: 'Hello, world!',
                userId: 9999
            }

            const response = await supertest(app)
                .post("/posts")
                .send(request)

            expect(response.status).toEqual(409)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe("DELETE /posts", () => {
        it("should let admins delete any post", async () => {
            const user = await createUser('john', '123456')
            const admin = await createUser('admin', '123456', 'ADMIN')
            const post = await createPost('Hello, world!', user.id)
            const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET)

            const response = await supertest(app)
                .delete(`/posts/${post.id}`)
                .auth(token, {type: 'bearer'})
                .send()
            
            expect(response.status).toEqual(200)
            expect(response.body.post).not.toEqual(undefined)
            expect(response.body.post.title).toEqual('Hello, world!')
        })

        it("should let a user delete their own posts", async () => {
            const user = await createUser('john', '123456')
            const post = await createPost('Hello, world!', user.id)
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

            const response = await supertest(app)
                .delete(`/posts/${post.id}`)
                .auth(token, {type: 'bearer'})
                .send()
            
            expect(response.status).toEqual(200)
            expect(response.body.post).not.toEqual(undefined)
            expect(response.body.post.title).toEqual('Hello, world!')
        })

        it("should return a 403 status code when a user tries to delete another users post", async () => {
            const user1 = await createUser('john', '123456')
            const user2 = await createUser('jane', '123456')

            // user1 creates a post
            const post = await createPost('Hello, world!', user1.id)

            // user2's token
            const token = jwt.sign({ sub: user2.id }, process.env.JWT_SECRET)

            const response = await supertest(app)
                .delete(`/posts/${post.id}`)
                .auth(token, {type: 'bearer'})
                .send()
            
            expect(response.status).toEqual(403)
            expect(response.body).toHaveProperty('error')
        })
    })
})