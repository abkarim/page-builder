import axios from "axios";

const productionURL = '/';
const devURL = 'http://localhost';

export default axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? productionURL : devURL,
});