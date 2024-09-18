/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

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
    console.log(getNewBoard)

    // Return Results. In Services. there must always be return
    return getNewBoard
  } catch (error) { throw error }
}

export const boardService = {
  createBoard
}