const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body

        const database = await sqliteConnection()
        const checkUserExists = await database.get("select * from users where email = (?)", [email])

        if (checkUserExists){
            throw new AppError("Este email já está cadastrado")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("insert into users (name, email, password) values (?, ?, ?)", [name, email, hashedPassword])

        return response.status(201).json()
    }

    async update(request, response){
        const {name, email, password, oldPassword} = request.body
        const {id} = request.params

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if(!user){
            throw new AppError("Usuario não encontrado")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este email já está em uso")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !oldPassword){
            throw new AppError("Você precisa informar a senha antiga para definir a senha nova")
        }

        if(password && oldPassword){
            const checkOldPassword = await compare(oldPassword, user.password)

            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME("now")
            WHERE id = ?`,
            [user.name, user.email, user.password, id]
            )

            return response.status(200).json()
    }
}

module.exports = UsersController