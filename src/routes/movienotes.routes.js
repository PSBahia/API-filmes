const {Router} = require('express')

const MovieNotesController = require('../controllers/MovieNotesController')

const movienotesRoutes = Router()

const movieNotesController = new MovieNotesController()

movienotesRoutes.get("/",  movieNotesController.index)
movienotesRoutes.post("/:user_id",  movieNotesController.create)
movienotesRoutes.get("/:id",  movieNotesController.show)
movienotesRoutes.delete("/:id",  movieNotesController.delete)

module.exports = movienotesRoutes