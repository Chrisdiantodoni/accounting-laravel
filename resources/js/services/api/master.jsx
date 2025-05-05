import instance from "../instance";

class master {
    async getDealer(query) {
        return await instance
            .get(`/public/dealer/list?${query}`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    }
    async getDealerNeq(query) {
        return await instance
            .get(`/public/dealer-neq/list?${query}`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    }
}
export default new master();
