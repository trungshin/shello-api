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

export const boardController = {
  createBoard
}