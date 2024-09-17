/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createBoard = async (reqBody) => {
  try {
    // Process data logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call the Model layer to process and save the newBoard record into the Database
    // Return Results. In Services. there must always be return
    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  createBoard
}