import AsyncStorage from '@react-native-async-storage/async-storage';
import queryString from 'query-string';
import Constants from '../constants/Variables';

export const Token = {
  get() {
    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          // We have data!!
          return value;
        }
        return null;
      } catch (error) {
        // Error retrieving data
        return null;
      }
    };
  },
  set(value) {
    _storeData = async () => {
      try {
        await AsyncStorage.setItem('token', value);
      } catch (error) {
        // Error saving data
      }
    };
  }
};

export const http = (() => {
  const apiUrl = `${Constants.BASE_URL}`;
  function withDefaultHeaders(config, token) {
    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
  }

  function evaluateResponse(response) {
    if (response.status === 401) {
      AsyncStorage.clear();
      this.props.navigation.navigate('SignIn');
      return response.json().then(error => Promise.reject(error.error));
    }
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    return response.json().then(error => Promise.reject(error.error));
  }

  return {
    async request(config = {}) {
      const token = tokenProvider.get(TOKEN_NAME);
      const response = await fetch(`${apiUrl}/${config.url}`, withDefaultHeaders(config, token));
      return evaluateResponse(response);
    },
    async get(url, config = {}, params = {}) {
      const token = await AsyncStorage.getItem('token');
      config.url = url;
      const response = await fetch(
        `${apiUrl}/${url}?${queryString.stringify(params)}`,
        withDefaultHeaders(config, token)
      );
      return evaluateResponse(response);
    },
    async post(url, data, config = {}) {
      const token = await AsyncStorage.getItem('token');
      config.url = url;
      config.method = 'POST';
      config.body = JSON.stringify(data);
      const response = await fetch(`${apiUrl}/${url}`, withDefaultHeaders(config, token));
      return evaluateResponse(response);
    },
    async patch(url, data, config = {}) {
      const token = await AsyncStorage.getItem('token');
      config.url = url;
      config.method = 'PATCH';
      config.body = JSON.stringify(data);
      const response = await fetch(`${apiUrl}/${url}`, withDefaultHeaders(config, token));
      return evaluateResponse(response);
    },
    async delete(url, config = {}) {
      const token = tokenProvider.get(TOKEN_NAME);
      config.url = url;
      config.method = 'DELETE';
      const response = await fetch(`${apiUrl}/${url}`, withDefaultHeaders(config, token));
      return evaluateResponse(response);
    }
  };
})();
