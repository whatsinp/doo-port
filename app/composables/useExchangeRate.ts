import { useFetch } from '#app'

export const useExchangeRate = () => {
  const { data, pending, error } = useFetch('https://api.exchangerate-api.com/v4/latest/USD', {
    key: 'exchange-rate-usd',
    server: false, // only fetch on client side to avoid SSR issues or rate limits
    lazy: true, // don't block navigation
    transform: (response: any) => {
      return response?.rates?.THB || 33.07
    },
    default: () => 33.07
  })

  return {
    exchangeRateTHB: data,
    loading: pending,
    error
  }
}
