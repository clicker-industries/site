import Vue from 'vue';
import Vuex from 'vuex';
import vapeV4 from "./vapeV4";

Vue.use(Vuex);

var vapeLite = {
    namespaced: true,
    state: function () {
        return {
            curStep: 1,
            previousStep: 1,
            isContinueDisabled: true,
            isUserAuthenticated: false,
            disabledTopNav: false,
            liteSubscription: {
                product: 2,
                productId: 1,
                name: 'sub',
                price: '9.99',
                price_old: false,
                selected: true,
                recurring: true,
                purchased: false,
                paused: false,
                authorizeCode: 3,
                tebexCode: ''
            },
            litePermanent: {
                product: 2,
                productId: 5,
                name: 'perm',
                price: '59.99',
                price_old: false,
                selected: false,
                recurring: false,
                purchased: false,
                authorizeCode: 6,
                payPalCode: 'SF8D8XDXFRMS6',
                citConCode: '5',
                amazonCode: '5',
                tebexCode: '6'
            },
            user: {
                id: '',
                username: '',
                email: '',
                isAdmin: false
            },
            possiblePaymentTypes: {
                payPal: {
                    name: 'PayPal',
                    enabled: true
                },
                stripe: {
                    name: 'Stripe',
                    enabled: true
                },
                card: {
                    name: 'Card',
                    enabled: true
                },
                amazon: {
                    name: 'Amazon',
                    enabled: false
                },
                aliPay: {
                    name: 'AliPay',
                    enabled: false
                },
                weChat: {
                    name: 'WeChat',
                    enabled: false
                }
            },
            registerObj: {},
            pendingPaymentRequest: false,
            successResponse: false
        };
    },
    mutations: {
        proceedToNextStep: function (state) {
            state.previousStep = state.curStep;
            if (state.curStep === 1 && !state.isUserAuthenticated) {
                state.curStep = 2;
            } else if (state.curStep === 1 && state.isUserAuthenticated) {
                state.curStep = 3;
            } else if (state.curStep < 3) {
                state.curStep++;
            }
        },
        enableNextStep: function (state) {
            state.isContinueDisabled = false;
        },
        disableNextStep: function (state) {
            state.isContinueDisabled = true;
        },
        selectSubscription: function (state) {
            state.liteSubscription.selected = true;
            state.litePermanent.selected = false;
        },
        selectPermanent: function (state) {
            state.litePermanent.selected = true;
            state.liteSubscription.selected = false;
        },
        authenticateUser: function (state, user) {
            state.isUserAuthenticated = true;
            state.user = Object.assign({}, user);
            // Temporary
            state.possiblePaymentTypes.card.enabled = false;
        },
        setPaymentOptions: function (state) {
            if (state.litePermanent.selected === true) {
                for (const [key, val] of Object.entries(state.possiblePaymentTypes)) {
                    val.enabled = true;
                }
            } else {
                for (const [key, val] of Object.entries(state.possiblePaymentTypes)) {
                    val.enabled = key === 'stripe' || key === 'payPal';
                }
            }
            // Disable Card payments
            state.possiblePaymentTypes.card.enabled = false;
            // Disable WeChat payments
            state.possiblePaymentTypes.weChat.enabled = false;
        },
        bindRegisterInputsToRegisterObject: function (state, payload) {
            state.registerObj = Object.assign({}, payload);
        },
        clearRegisterObjPassword: function (state) {
            delete state.registerObj.password;
        },
        updateSubsPrice: function (state, price) {
            state.liteSubscription.price = price;
        },
        updatePermanentPrice: function (state, price) {
            state.litePermanent.price = price;
        },
        updateSubsPriceOld: function (state, price) {
            state.liteSubscription.price_old = price;
        },
        updatePermanentPriceOld: function (state, price) {
            state.litePermanent.price_old = price;
        },
        pendingPayment: function (state) {
            state.pendingPaymentRequest = true;
        },
        successResponse: function (state) {
            state.pendingPaymentRequest = false;
            state.successResponse = true;
        },
        setStep: function (state, step) {
            if (step > 0 && step < 4) {
                state.previousStep = state.curStep;
                state.curStep = step;
                if (state.curStep === 1 && state.isContinueDisabled === true) {
                    state.isContinueDisabled = false;
                }
            }
        },
        goBack: function (state) {
            if (state.previousStep === 2 && state.user.id !== '') {
                state.curStep = 1;
            }
            state.curStep = state.previousStep;
        },
        setSubscriberStatus: function (state) {
            state.liteSubscription.purchased = true;
            state.liteSubscription.selected = false;
            state.litePermanent.selected = true;
        },
        setHasPermanent: function (state) {
            state.liteSubscription.purchased = true;
            state.litePermanent.purchased = true;
            state.litePermanent.selected = false;
            state.liteSubscription.selected = false;
            state.disabledTopNav = true;
        },
        setHasPaused: function (state) {
            state.liteSubscription.paused = true;
        }
    },
    getters: {
        selectedProduct: function (state) {
            return state.liteSubscription.selected ? state.liteSubscription : state.litePermanent;
        }
    }
};

export default vapeLite;
