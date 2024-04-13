const {Router} = require('express')

const usersRouter = require("./users.routes")
const movienotesRouter = require("./movienotes.routes")
const moviestagsRouter = require("./movietags.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/movienotes", movienotesRouter)
routes.use("/movietags", moviestagsRouter)


module.exports = routes