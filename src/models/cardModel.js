import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Specify fields that are not allowed to be updated in the updateBoard function
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createCard = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
      columnId: new ObjectId(validateData.columnId)
    }
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) { throw new Error(error) }
}

const updateCard = async (cardId, updateData) => {
  try {
    // Filter out fields that are not allowed to be updated
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId)
    }

    return await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { ReturnDocument: 'after' }
    )
  } catch (error) { throw new Error(error) }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createCard,
  findOneById,
  updateCard
}