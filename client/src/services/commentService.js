import http from "../http-common";

export const getAll = async (sortBy, orderBy, page, limit = 25) => {
  const { data } = await http.get("/comments", {
    params: {
      sortBy,
      orderBy,
      page,
      limit,
    },
  });

  return data;
};

export const getReplies = async (id) => {
  return http.get(`/comments/${id}`);
};

export const create = async (comment) => {
  const { data } = await http.post("/comments", comment, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
    return true;
  }
  return false;
};
