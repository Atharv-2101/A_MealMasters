import api from "./api";

// orders by status
export const getOrdersByStatus = (status) => {
  return api.get(`/admin/ordersByStatus/${status}`);
};

// all orders
export const getAllOrders = () => {
  return api.get("/admin/allOrders");
};

// all registered customers
export const getRegisteredUsers = () => {
  return api.get("/admin/customerList");
};

// all vendors
export const getVendors = () => {
  return api.get("/admin/vendorList");
};

export const getUserDetails = (userId) => {
  return api.get(`/admin/user/${userId}`)
}

// add delivery person
export const addDeliveryPerson = (data) => {
  return api.post("/admin/addDelivery", data)
}

// get all delivery persons (optional, for list screen)
export const getDeliveryPersons = () => {
  return api.get("/admin/delivery")
}