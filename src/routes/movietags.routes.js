const {Router} = require('express')

const MovieTagsController = require("../controllers/MovieTagsController")

const moviestagsRoutes = Router()

const movieTagsController = new MovieTagsController()

moviestagsRoutes.get("/:user_id", movieTagsController.index)

module.exports = moviestagsRoutes