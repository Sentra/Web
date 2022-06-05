import axios from 'axios';

export default axios.create({
    baseURL: 'https://montracapi1.azurewebsites.net/api',
    headers: {
        'Content-type': 'application/json'
    }
});
