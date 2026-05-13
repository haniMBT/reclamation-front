import { boot } from 'quasar/wrappers'
import axios from 'axios'
import moment from "moment";
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth'
import { LocalStorage } from 'quasar'

axios.defaults.withCredentials = true;//

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
})
export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  // api.interceptors.request.use(
  //   async (req) => {
  //     if (
  //       // !req.url.includes('/api/log-history')
  //       //   &&
  //       // !req.url.includes('notification')
  //       //   &&
  //       // !req.url.includes('/advanced-search-meta-data')
  //       //   &&
  //       // !req.url.includes('/directions')
  //       //   &&
  //       // !req.url.includes('/privileges')
  //       // &&
  //       // req.url.includes('/login')
  //       // ||
  //       req.url.includes('/logout')
  //     ) {
  //       let log = {
  //         time: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss'),
  //         route: req.url.split('api')[1]
  //       }
  //       await api
  //         .post(
  //           '/api/log-history/store',
  //           {...log}
  //         )
  //         .then()
  //         .catch(err => console.error(err))
  //     }
  //     return req;
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   }
  // )

  api.interceptors.request.use(function async (config) {
    // const token = localStorage.getItem('access_token'); // Fetch token from local storage
    const authStore = useAuthStore();
    const token = authStore.access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set token in request headers
    }
    // Créez l'objet log
    const log = {
      time: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss'),
      route: config.url.split('api')[1],
    };
    // Ajoutez l'objet log à chaque requête (par exemple dans les en-têtes)
    config.headers['X-Log'] = JSON.stringify(log);

    return config;
}, function (error) {
    return Promise.reject(error);
});


  api.interceptors.response.use(//
    async (response) => {
      return response
    },
    (error) => {
      const { response } = error
      if (response && (response.status === 401 || response.status === 419 || response.data.message == 'Unauthenticated.')){

        LocalStorage?.clear();
        router.push({ name: 'login' })
      }

      return Promise.reject(error)
    }
  )//




})

export { axios, api }
