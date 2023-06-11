import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// config
import { Provider as ReduxProvider } from 'react-redux'
import reduxStore from "../src/config/reduxStore"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={reduxStore}>
      <Component {...pageProps} />
    </ReduxProvider>
  )
}
