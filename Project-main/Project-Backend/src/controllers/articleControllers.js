import db from '../config/db.js'

// GET ALL
export const getArticles = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM articles ORDER BY id DESC'
        )
        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET BY ID
export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params

        const [rows] = await db.execute(
            'SELECT * FROM articles WHERE id = ?',
            [id]
        )

        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// CREATE (ADMIN)
export const createArticle = async (req, res) => {
    try {
        const { title, description, image, content } = req.body

        await db.execute(
            'INSERT INTO articles (title, description, image, content) VALUES (?, ?, ?, ?)',
            [title, description, image, content]
        )

        res.json({ message: 'เพิ่มบทความสำเร็จ' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE (ADMIN)
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params

        await db.execute(
            'DELETE FROM articles WHERE id = ?',
            [id]
        )

        res.json({ message: 'ลบบทความสำเร็จ' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}