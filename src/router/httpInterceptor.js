import axios from 'axios';
import store from '@/store';

import { STORAGE_KEY_TOKEN, STORAGE_KEY_REDIRECT, PUBLIC_PAGES } from '@/variables'; // Localstorage key for token is defined in store

export default function setup() {
  // Adds the auth token in the header of every API call
  axios.interceptors.request.use(
    function(config) {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);

      // If token exists then add it to header
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }

      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );

  // Checks every API response
  axios.interceptors.response.use(
    response => {
      // If token is set in data or headers, update it
      let token = response.headers.token;

      if (typeof token !== 'undefined') {
        store.dispatch('updateToken', token);
      }

      return response;
    },
    error => {
      const status = error.response ? error.response.status : null;

      // 401 = not authenticated
      // 428 = 2-factor authentication required

      if (status === 401 || status === 428) {
        const path = window.location.pathname;
        if (!PUBLIC_PAGES.includes(path)) {
          localStorage.setItem(STORAGE_KEY_REDIRECT, path);

          if (status === 428) {
            // 2FA required
            window.location.href = '/login?mfa=1';
          } else {
            // Session expired - logout
            store.dispatch('logout', { redirect: path, serverError: true }).then(response => {
              if (response !== 'error') {
                // @todo use router
                //window.location.href = '/login';
              }
            });
          }
        }
      }

      return Promise.reject(error);
    }
  );
}
