import { useAuth } from '~/features/auth/composables/useAuth'
import { getAuth } from 'firebase/auth'

export const useLedger = () => {
  const config = useRuntimeConfig()
  const auth = useAuth()

  const getAuthToken = async () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('Not logged in')
    return await user.getIdToken()
  }

  const processBuy = async (
    portfolioId: string,
    assetSymbol: string,
    quantity: number,
    unitPrice: number,
    tradeCurrency: string = 'USD'
  ) => {
    const token = await getAuthToken()
    const response = await $fetch(
      `${config.public.apiBaseUrl}/transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          portfolioId,
          assetSymbol: assetSymbol.toUpperCase(),
          quantity,
          unitPrice,
          tradeCurrency
        }
      }
    )
    return response
  }

  const processSell = async (
    portfolioId: string,
    assetSymbol: string,
    quantity: number,
    unitPrice: number,
    tradeCurrency: string = 'USD'
  ) => {
    const token = await getAuthToken()
    const response = await $fetch(
      `${config.public.apiBaseUrl}/transactions/sell`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          portfolioId,
          assetSymbol: assetSymbol.toUpperCase(),
          quantity,
          unitPrice,
          tradeCurrency
        }
      }
    )
    return response
  }

  const deleteHolding = async (portfolioId: string, assetSymbol: string) => {
    const token = await getAuthToken()
    const response = await $fetch(
      `${config.public.apiBaseUrl}/transactions/holding/${portfolioId}/${assetSymbol.toUpperCase()}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response
  }

  return { processBuy, processSell, deleteHolding }
}
