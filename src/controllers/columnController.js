import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createColumn = async (req, res, next) => {
  try {
    const createColumn = await columnService.createColumn(req.body)
    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) { next(error) }
}

const updateColumn= async (req, res, next) => {
  try {
    const columnId = req.params.id
    const updateColumn = await columnService.updateColumn(columnId, req.body)

    res.status(StatusCodes.OK).json(updateColumn)
  } catch (error) { next(error) }
}

const deleteColumn= async (req, res, next) => {
  try {
    const result = await columnService.deleteColumn(req.params.id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}


export const columnController = {
  createColumn,
  updateColumn,
  deleteColumn
}