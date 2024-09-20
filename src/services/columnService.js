import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createColumn = async (reqBody) => {
  try {
    const newColumn = { ...reqBody }

    const createColumn = await columnModel.createColumn(newColumn)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    if (getNewColumn) {
    // Processing data structure before return data
      getNewColumn.cards = []

      // Update columnOrderIds array in collection boards
      await boardModel.updateColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const updateColumn = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updateColumn = await columnModel.updateColumn(columnId, updateData)
    return updateColumn
  } catch (error) { throw error }
}

const deleteColumn = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    // Delete Column
    await columnModel.deleteColumnById(columnId)
    // Delete all Cards in Column
    await cardModel.deleteManyByColumnId(columnId)
    // Delete ColumnId in the columnOrderIds array of the Board containing it
    await boardModel.deleteColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Card deleted Successfully!' }
  } catch (error) { throw error }
}

export const columnService = {
  createColumn,
  updateColumn,
  deleteColumn
}