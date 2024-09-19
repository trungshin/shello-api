import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createCard = async (reqBody) => {
  try {
    const newCard = { ...reqBody }

    const createCard = await cardModel.createCard(newCard)
    const getNewCard = await cardModel.findOneById(createCard.insertedId)

    if (getNewCard) {
      // Update cardOrderIds array in collection columns
      await columnModel.updateCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

export const cardService = {
  createCard
}