import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(255).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
  }
}

export const boardValidation = {
  createBoard
}