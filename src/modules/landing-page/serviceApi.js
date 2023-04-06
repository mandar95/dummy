import HttpClient from "../../api/httpClient";

const info = () => HttpClient('/admin/get/employer/page', { method: "GET" });

const email = (data) => HttpClient('/admin/create/subscriber', { method: "POST", data });

const aboutUs = () => HttpClient('/admin/get/about-us', { method: "GET" });

const getBrokerHome = () => HttpClient(`/admin/get/broker/page`);

const demo = (data) => HttpClient('/admin/store/demo-details', { method: "POST", data });

const userTypeInput = (id) => HttpClient(`/admin/edit/landing-page/${id}`);

const userTypeUpdate = (id, data) => HttpClient(`/admin/update/landing-page/${id}`, { method: "POST", data, dont_encrypt: true });

export { info, email, aboutUs, getBrokerHome, demo, userTypeInput, userTypeUpdate }
