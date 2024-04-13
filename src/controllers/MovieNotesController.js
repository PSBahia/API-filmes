const knex = require("../database/knex")

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, movies_tags} = request.body
        const { user_id } = request.params

        const [note_id] = await knex("movies_notes").insert({
            title, description, rating, user_id
        })

        const tagsInsert = movies_tags.map(title => {
            return{
                note_id,
                title,
                user_id
            }
        })

        await knex("movies_tags").insert(tagsInsert)


        response.json()
    }

    async show(request, response){
        const {id} = request.params

        const note = await knex("movies_notes").where({id}).first()
        const tags = await knex("movies_tags").where({ note_id: id}).orderBy("title")

        return response.json({...note, tags})
    }

    async delete(request, response){
        const {id} = request.params

        await knex("movies_notes").where({id}).delete()

        return response.json()
    }

    async index(request, response){
        const {title, user_id, movies_tags} = request.query

        let notes

        if(movies_tags){
            const filterTags = movies_tags.split(',').map(tag => tag.trim())

            notes = await knex("movies_tags")
            .select([
                "movies_notes.id",
                "movies_notes.title",
                "movies_notes.user_id"
            ])
            .where("movies_notes.user_id", user_id)
            .whereLike("movies_notes.title", `%${title}%`)
            .whereIn("title", filterTags)
            .innerJoin("movies_notes", "movies_notes.id", "movies_tags.note_id")
            .orderBy("movies_notes.title")
        }
        else{
            notes = await knex("movies_notes").where({user_id}).whereLike("title", `%${title}%`).orderBy("title")
        }

        const userTags = await knex("movies_tags").where({user_id})
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note, movies_tags: noteTags
            }
        })

        return response.json(notesWithTags)
    }
}

module.exports = MovieNotesController