import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createBoard = async (req, res, next) => {
  try {
    // console.log(req.body)
    // Navigate data to the Service layer
    const createBoard = await boardService.createBoard(req.body)
    // Return results to the Client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const updateBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updateBoard = await boardService.updateBoard(boardId, req.body)

    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createBoard,
  getDetails,
  updateBoard,
  moveCardToDifferentColumn
}