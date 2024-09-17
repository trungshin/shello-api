import { StatusCodes } from 'http-status-codes'

const createBoard = async (req, res, next) => {
  try {
    // console.log(req.body)
    // Navigate data to the Service layer
    // Return results to the Client
    res.status(StatusCodes.CREATED).json({ message: 'Note: API create new boards' })
  } catch (error) { next(error) }
}

export const boardController = {
  createBoard
}