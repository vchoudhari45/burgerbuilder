import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-f58a5.firebaseio.com/'
});

export default instance;