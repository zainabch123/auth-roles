const supertest = require("supertest")
const app = require("../../../src/server.js")
const { createUser } = require("../../helpers/createUser.js")
const jwt = require('jsonwebtoken')

describe("User Endpoint", () => {
    describe("POST /users", () => {
        it("will create a new user", async () => {
            const request = {
                username: "john",
                password: "123456"
            }

            const response = await supertest(app)
                .post("/users")
                .send(request)

            expect(response.status).toEqual(201)
            expect(response.body.user).not.toEqual(undefined)
            expect(response.body.user.id).not.toEqual(undefined)
            expect(response.body.user.username).toEqual(request.username)
            expect(response.body.user.role).toEqual('USER')
        })

        it("will return 400 if one of the required fields is missing", async () => {
            const response = await supertest(app).post("/users").send({})

            expect(response.status).toEqual(400)
            expect(response.body).toHaveProperty('error')
        })

        it("will return 409 when attemping to register a customer with an in-use username", async () => {
            const request = {
                username: "john",
                password: "123456"
            }

            await createUser(request.username, request.password)

            const response = await supertest(app)
                .post("/users")
                .send(request)

            expect(response.status).toEqual(409)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe("GET /users", () => {
        it("should let admins get a list of users", async () => {
            const admin = await createUser('admin', '123456', 'ADMIN') // create an admin user
            const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET)

            let i = 5
            while (i --> 0) {
                await createUser(`user${i}`, '123456')
            }

            const response = await supertest(app)
                .get("/users")
                .auth(token)
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.users).not.toEqual(undefined)
            expect(response.body.users.length).toBeGreaterThan(0)
        })

        it("should return a 403 status code when a non-admin tries to get a list of users", async () => {
            const user = await createUser('mattbellamy', '123456') // create a standard user
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

            let i = 5
            while (i --> 0) {
                await createUser(`user${i}`, '123456')
            }

            const response = await supertest(app)
                .get("/users")
                .auth(token)
                .send()

            expect(response.status).toEqual(403)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe("DELETE /users", () => {
        it("should let admins delete a user", async () => {
            const admin = await createUser('admin', '123456', 'ADMIN') // create an admin user
            const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET)

            const user = await createUser('john', '123456')

            const response = await supertest(app)
                .delete(`/users/${user.id}`)
                .auth(token)
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.user).not.toEqual(undefined)
            expect(response.body.user.id).toEqual(user.id)
            expect(response.body.user.username).toEqual(user.username)
        })

        it("should return a 403 status code when a non-admin tries to delete another user", async () => {
            const user = await createUser('mattbellamy', '123456') // create a standard user
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

            const userToDelete = await createUser('john', '123456')

            const response = await supertest(app)
                .delete(`/users/${userToDelete.id}`)
                .auth(token)
                .send()

            expect(response.status).toEqual(403)
            expect(response.body).toHaveProperty('error')
        })

        it("should let users delete themselves", async () => {
            const user = await createUser('john', '123456')
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

            const response = await supertest(app)
                .delete(`/users/${user.id}`)
                .auth(token)
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.user).not.toEqual(undefined)
            expect(response.body.user.id).toEqual(user.id)
            expect(response.body.user.username).toEqual(user.username)
        })
    })
})