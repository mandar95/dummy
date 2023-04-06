import httpClient from "api/httpClient";

const getServiceManager = () => httpClient("/admin/get/service-manager");

const createServiceManager = (payload) =>
  httpClient("/admin/create/service-manager", {
    method: "POST",
    data: payload,
  });

const updateStatusOfServiceManager = (payload, newpayload) =>
  httpClient(`/admin/update/service-manager/${payload.id}`, {
    method: "POST",
    data: newpayload,
  });

const updateServiceManager = (id, payload) =>
  httpClient(`/admin/update/service-manager/${id}`, {
    method: "POST",
    data: payload,
  });

export default {
  getServiceManager,
  createServiceManager,
  updateStatusOfServiceManager,
  updateServiceManager,
};
