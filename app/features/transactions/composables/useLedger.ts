import { useAuth } from '~/features/auth/composables/useAuth'
import { getAuth } from 'firebase/auth'

export const useLedger = () => {
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
      'http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/transactions',
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

  return { processBuy }
}
