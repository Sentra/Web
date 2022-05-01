import axios from 'axios';

let user = JSON.parse(sessionStorage.getItem('user'));

export default axios.create({
    baseURL: 'https://montracapi20220413154050.azurewebsites.net/api',
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    }
});
