import axios from 'axios';

export default axios.create({
    baseURL: 'https://montracapi20220507053436.azurewebsites.net/api',
    headers: {
        'Content-type': 'application/json'
    }
});
