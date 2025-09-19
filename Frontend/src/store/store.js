import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../authSlice';

export const store = configureStore({
    reducer:{
        auth: authReducer  //auth hmare slice ka name hogua or authReducer jo hmare reducer hai
    }
}); 