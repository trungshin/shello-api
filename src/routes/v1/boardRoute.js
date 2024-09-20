import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: API get list boards' })
  })
  .post(boardValidation.createBoard, boardController.createBoard)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.updateBoard, boardController.updateBoard)

Router.route('/update_card/different_column')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router
