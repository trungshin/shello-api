/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

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

    const resBoard = cloneDeep(board)
    // Return card to its correct column
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // Remove the cards array from the original board
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

const updateBoard = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updateBoard = await boardModel.updateBoard(boardId, updateData)
    return updateBoard
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Update the cardOrderIds array of the original column that contains it
    await columnModel.updateColumn(reqBody.preColumnId, {
      cardOrderIds: reqBody.preCardOrderIds,
      updateAt: Date.now()
    })

    // Update the cardOrderIds array of the next column
    await columnModel.updateColumn(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })

    // Update the columnId field of the dragged card
    await cardModel.updateCard(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { result: 'Successfully!' }
  } catch (error) { throw error }
}

export const boardService = {
  createBoard,
  getDetails,
  updateBoard,
  moveCardToDifferentColumn
}