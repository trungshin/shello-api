import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

// Define Collection
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array().items(Joi.string()).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Specify fields that are not allowed to be updated in the updateBoard function
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createBoard = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validateData)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) { throw new Error(error) }
}

const getDetails = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(id), _destroy: false } },
      { $lookup: { from: columnModel.COLUMN_COLLECTION_NAME, localField: '_id', foreignField: 'boardId', as: 'columns' } },
      { $lookup: { from: cardModel.CARD_COLLECTION_NAME, localField: '_id', foreignField: 'boardId', as: 'cards' } }
    ]).toArray()
    return result[0] || null
  } catch (error) { throw new Error(error) }
}

// Push a columnId value to the end of the columnOrderIds array
const updateColumnOrderIds = async (column) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' }
    )
  } catch (error) { throw new Error(error) }
}

const updateBoard = async (boardId, updateData) => {
  try {
    // Filter out fields that are not allowed to be updated
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { ReturnDocument: 'after' }
    )
  } catch (error) { throw new Error(error) }
}

const deleteColumnOrderIds = async (column) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' }
    )
  } catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createBoard,
  findOneById,
  getDetails,
  updateColumnOrderIds,
  updateBoard,
  deleteColumnOrderIds
}