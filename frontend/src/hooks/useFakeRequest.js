import { useCallback, useEffect, useState } from 'react'

/*
  Simula una petición a la API mientras no hay backend.
  Devuelve { loading, error, data, retry }.
  Cuando exista la API, cambia el cuerpo por: fetch(url).then(r => r.json())
*/
export default function useFakeRequest(getData, { delay = 700 } = {}) {
  const [state, setState] = useState({ loading: true, error: null, data: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    const id = setTimeout(() => {
      if (!alive) return
      try {
        // Sin internet también se muestra el estado de error
        if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error('offline')
        setState({ loading: false, error: null, data: getData() })
      } catch (e) {
        setState({ loading: false, error: e, data: null })
      }
    }, delay)
    return () => { alive = false; clearTimeout(id) }
  }, [attempt]) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}
