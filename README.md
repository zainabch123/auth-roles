# Role-based Access Control

> Role-based access control (RBAC) restricts access to all or some features of an application based on a user's role within the application. For example, only users with an `Admin` role should be able to approve or delete other users; only users with a `Dev` role should have access to debug logs.
>
> We call this part of auth: "Authorization". Authentication is verifying the credentials of a user, Authorization is verifying that the user can access certain features.

## Learning Objectives

- Implement bearer authentication and authorization
- Use role-based authorization to limit API access to specific user groups
- Use enums in Prisma to define two user roles: User and Admin

## Setting up

1. Create a new database instance in ElephantSQL and create a schema called 'prisma' in it
    - `create schema prisma;`
2. Rename the `.env.example` file to `.env`
3. Edit the `DATABASE_URL` variable in `.env`, swapping `YOUR_DATABASE_URL` for the URL of the database you just created. Leave `?schema=prisma` at the end.
4. Edit the `SHADOW_DATABASE_URL` variable in `.env`, swapping `YOUR_SHADOW_DATABASE_URL` for the URL of the shadow database you created in the earlier exercises. Leave `?schema=shadow` at the end.
5. If you have not previously done so (e.g. for a past exercise), create another separate **TEST** database instance. Make sure you create a schema called 'prisma' in it.
6. Edit the `TEST_DATABASE_URL` variable in `.env`, swapping `YOUR_TEST_DB_URL` for the URL of the separate **TEST** database instance you just created. Leave `?schema=prisma` at the end.
7. Run `npm ci` to install the project dependencies.
8. Run `npx prisma migrate reset` to execute the existing migrations & data seed. Press `y` when it asks if you're sure.

## Instructions

Run the app with `npm start`

1. Use an enum to define two roles in the prisma schema: `USER` and `ADMIN`. Add a role property to the User model, defaulting to the USER role.
    - https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums
2. Create a migration for your schema changes & regenerate the prisma client. Revisit previous exercises if you need a refresher on the commands needed for this.
3. Explore the [test/api/routes/user.spec.js](./test/api/routes/user.spec.js) and [test/api/routes/post.spec.js](./test/api/routes/post.spec.js) files to figure out the next steps. The exercise is considered complete when all of the tests pass. You must not change any of the tests.

## Extensions

**Option 1**
- Create a front-end application to consume this API. You are free to use any technology for this - the only requirements are:
    - registration & login forms
    - post creation & post list views
    - a page that only admins can access to view a list of users
    - (optional extra) admins can delete posts and users
    - (optional extra) users can delete their own posts
    - (optional extra) user-friendly error messages on the frontend

**Option 2**
- Switch Bearer auth for a different style of auth (e.g. OAuth2, passport.js)

**Option 3**
- Implement a new model named `Permission` which connects roles to specific permissions. Example dataset:

| id | role | permission  |
|---|---|---|
| 1 | ADMIN | DELETE_ANY_USER |
| 2 | ADMIN | DELETE_ANY_POST |
| 3 | USER | CREATE_POSTS |
| 4 | USER | DELETE_MY_POST |
| 5 | USER | DELETE_MY_USER |

- You'll then need to check that the user performing an action has access to the relevant permission instead of just checking their role. For example, on `DELETE /posts/3` you'll check that the authenticated user has access to the `DELETE_MY_POST` permission if that post was created by the authenticated user, or the `DELETE_ANY_POST` permission if not.

This is one approach used for fine-tuning user permissions in an app.

## Testing your work

- First, make sure you have created / setup the test database instance and env var, as described in the "Setting Up" section.
- Next, run the command `npm run test:migration` - this will run the schema migrations against the test database. **You only need to do this the one time.**

Now, whenever you want to run tests locally:  
- Run the test suite with `npm test` for core requirements.
