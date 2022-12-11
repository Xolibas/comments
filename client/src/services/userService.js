import http from "../http-common";

export const check = async (ip) => {
    const {data} = await http.get(`/users/${ip}`)
    if (data.userFound) {
        localStorage.setItem('token', data.token)
        return true;
    }

    localStorage.removeItem('token')

    return false;
}