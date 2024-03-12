import Vue from 'vue';
import Vuex from 'vuex';
import vapeLiteModule from './modules/vapelite';
import vapeV4Module from './modules/vapeV4';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        vapeLite: vapeLiteModule,
        vapeV4: vapeV4Module
    },
    state: {
        isNotificationEnabled: false
    },
    mutations: {
        setNotificationStatus(state, status) {
            state.isNotificationEnabled = status === 'enabled';
        }
    }
});

export default store;
