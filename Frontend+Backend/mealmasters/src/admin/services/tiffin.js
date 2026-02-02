import api from "./api";

// get all tiffins
export const getTiffins = () => {
  return api.get("/admin/tiffins");
};

// add tiffin
export const addTiffin = (data) => {
  return api.post("/admin/tiffins", data);
};

// delete tiffin
export const deleteTiffin = (id) => {
  return api.delete(`/admin/tiffins/${id}`);
};

