/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createBoard = async (reqBody) => {
  try {
    // Process data logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call the Model layer to process and save the newBoard record into the Database
    const createBoard = await boardModel.createBoard(newBoard)

    // Get the board after calling
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)

    // Return Results. In Services. there must always be return
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    return board
  } catch (error) { throw error }
}

export const boardService = {
  createBoard,
  getDetails
}