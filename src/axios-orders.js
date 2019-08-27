//jshint esversion:6
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-9c461.firebaseio.com/'
});

export default instance;
