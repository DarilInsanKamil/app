import { env } from '$env/dynamic/private'
import midtransClient from 'midtrans-client'

export const midtrans =  new midtransClient.Snap({
  isProduction: false,
  serverKey: env.MERCHANT_SERVER_KEY,
  clientKey: env.MERCHANT_CLIENT_ID
})
