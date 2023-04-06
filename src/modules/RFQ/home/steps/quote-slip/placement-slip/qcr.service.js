import HttpClient from "api/httpClient";

const loadQCRQuotes = (data) =>
  HttpClient("/admin/all-quote-slip-data", { method: "POST", data });

const addQuote = (data) =>
  HttpClient("/admin/quote-add-insurer", { method: "POST", data });

const updateInsurerData = (data) =>
  HttpClient("/admin/quote-update-insurer", { method: "POST", data });

const deleteQuoteSlip = (id) =>
  HttpClient(`/admin/delete/quote-slip-data/${id}`, { method: "DELETE" });

const deleteInsurer = (insurer_id, quote_id) =>
  HttpClient(`/admin/delete/quote-insurer/${quote_id}/${insurer_id}`, { method: "DELETE" });

const sendPlacementSlip = (data) =>
  HttpClient("/admin/quote-send-placement-slip", { method: "POST", data });

const sendQouteSlip = (data) =>
  HttpClient("/admin/quoteslip-email", { method: "POST", data });

const loadAuditData = (data) =>
  HttpClient("/admin/quote-slip-audit", { method: "POST", data });

const downloadQuoteSlipPDF = (data) =>
  HttpClient("/admin/download-quote-slip", { method: "POST", data });

const buyQuote = (data) =>
  HttpClient("/admin/buy/quote-slip", { method: "POST", data });

const loadInsurer = () => HttpClient('/admin/get/master/insurer');



export default {
  loadQCRQuotes,
  addQuote,
  updateInsurerData,
  deleteQuoteSlip,
  deleteInsurer,
  sendPlacementSlip,
  sendQouteSlip,
  loadAuditData,
  downloadQuoteSlipPDF,
  buyQuote,
  loadInsurer
}
