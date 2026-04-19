import express from 'express'
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle
} from '../controllers/articleControllers.js'

const router = express.Router()

// PUBLIC
router.get('/', getArticles)
router.get('/:id', getArticleById)

// ADMIN
router.post('/', createArticle)
router.delete('/:id', deleteArticle)

export default router