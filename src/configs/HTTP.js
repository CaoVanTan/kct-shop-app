import axios from 'axios';
import { SERVER_URL } from '../configs/environment';

var HTTP = {};

const client = axios.create({
  baseURL: SERVER_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function post(url, options, success, failure) {
  client
    .post(url, options.body)
    .then(
      (res) => {
        if (
          res.data.error !== undefined &&
          res.data.error.message !== undefined
        ) {
          failure(res.data.error.message);
        } else {
          success(res.data);
        }
      },
      (err) => {
        failure(err.message);
      },
    )
    .catch((err) => {
      failure(err.message);
    });
}

HTTP.post = post;

export default HTTP;
