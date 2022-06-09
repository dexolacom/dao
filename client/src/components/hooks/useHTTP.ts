import {useState, useCallback} from 'react';


export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback( async (url:string, method:string, body = null, headers = {}) => {
    setLoading(true)
    try {
      if (body) {
        // @ts-ignore
        body = JSON.stringify(body)
        // @ts-ignore
        headers['Content-Type'] = 'application/json'
      }
      // @ts-ignore
      const response = await fetch(url, {method, body, headers})
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData?.data || 'request error')
      }
      setLoading(false)
      return responseData

    } catch (e:any) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = () => setError(null);

  return {loading, error, request, clearError}
};