import HttpClient from "../../../api/httpClient";

// load
const loadOrder = (data) => HttpClient('/admin/create-payment/order', { method: 'POST', data: data });
const saveOrder = (data, rfq) => HttpClient(`/admin/verify-order/payment${rfq ? '/rfq' : ''}`, { method: 'POST', data });

//activate account
const activate = (data) => HttpClient('/admin/toggle/client-status', { method: 'POST', data });

const paymentRFQ = (data) => HttpClient('/admin/create-payment/order/rfq', { method: 'POST', data })

export default { loadOrder, saveOrder, activate, paymentRFQ };
