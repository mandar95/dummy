import HttpClient from "../../api/httpClient";

const getEmployers = (id) =>
  HttpClient(`/broker/get/employers?broker_id=${id}`);

const modules = (userType) => HttpClient(`/admin/announcement/modules${userType ? `?user_type_name=${userType}` : ''}`);

const types = () => HttpClient("/admin/get/announcement/types");

const announcements = () => HttpClient("/admin/get/announcement");
const getAnnouncementId = (id) => HttpClient(`/admin/get/announcement/${id}`);
const updateAnnouncementId = (data, id) => HttpClient(`/admin/update/announcement/${id}`, { method: "POST", data, dont_encrypt: true });

const postAnncmt = (data) =>
  HttpClient("/admin/create/announcement", { method: "POST", data, dont_encrypt: true });

const deleteAnncmt = (id) => HttpClient(`/admin/delete/announcement/${id}`, { method: "DELETE" });

const position = () =>
  HttpClient("/admin/get/positions", { method: "GET" });

const alignment = () =>
  HttpClient("/admin/get/alignment", { method: "GET" });

const size = () =>
  HttpClient("/admin/get/size", { method: "GET" });

const subType = (data) =>
  HttpClient("/admin/get/announcement/sub-types", { method: "POST", data });

const anncmt = (userType) =>
  HttpClient(`/admin/get/annoucement/module-wise?user_type_name=${userType}`, { method: "GET" });

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployer = (userType) => HttpClient(`/admin/users?type=Employer&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployee = (userType) => HttpClient(`/admin/users?type=Employee&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const getUserNotificationData = (user_type) => HttpClient(`/admin/get/user-wise-notification?user_type_name=${user_type}`);
const updateUserNotificationData = (data) => HttpClient(`/admin/update/user-wise-notification`, { method: "POST", data, dont_encrypt: true });
const getAllNotification = () => HttpClient(`/admin/get/all-notification`);
const notificationType = () => HttpClient(`/admin/get/all-notification-type`);
const getAllModules = () => HttpClient(`/admin/modules`);
const addNotificationData = (data) => HttpClient(`/admin/add/notification`, { method: "POST", data });
const updateNotificationData = (data, id) => HttpClient(`/admin/update/notification/${id}`, { method: "POST", data, dont_encrypt: true });
const deleteNotificationData = (id) => HttpClient(`/admin/delete/notification/${id}`, { method: "DELETE" });
const editNotificationData = (id) => HttpClient(`/admin/edit/single-notification/${id}`);
const deleteUserNotificationData = (data) => HttpClient(`/admin/clear/notification`, { method: "POST", data });

// Notification Center
const loadActions = (id) => HttpClient('/admin/get/action');
const getBrokerModule = (id) => HttpClient('/admin/modules?onboard=0&user_type_name=Broker');

const customModule = (data) => HttpClient('/admin/get/user-type/module/mapping', { method: "POST", data });

export {
  getEmployers,
  modules,
  types,
  announcements,
  getAnnouncementId,
  updateAnnouncementId,
  postAnncmt,
  deleteAnncmt,
  position,
  alignment,
  size,
  subType,
  anncmt,
  adminGetBroker,
  adminGetEmployer,
  adminGetEmployee,
  addNotificationData,
  notificationType,
  getAllModules,
  getAllNotification,
  updateNotificationData,
  deleteNotificationData,
  editNotificationData,
  getUserNotificationData,
  updateUserNotificationData,
  loadActions, getBrokerModule,
  deleteUserNotificationData,
  customModule
};
