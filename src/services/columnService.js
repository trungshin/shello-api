import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

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

export const columnService = {
  createColumn
}