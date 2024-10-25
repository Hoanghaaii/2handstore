import express from 'express'
import PayOS from '@payos/node'

const payos = new PayOS('client_id','api_id','checksum_key')
const app = express()
app.use(express.static('public'))
app.use(express.json())

const DOMAIN = "http://localhost:3001"
app.post('/create-payment-link', async (req, res)=>{
    const order = {
        amount: 10000,
        description: "Thanh toan ao",
        orderCode: 10,
        returnUrl: `${DOMAIN}/success.html`,
        cancelUrl: `${DOMAIN}/cancel.html`,
    }
    const paymentLink = await payos.createPaymentLink(order)
    res.redirect(303, paymentLink.checkoutUrl)
})

