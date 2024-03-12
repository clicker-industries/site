import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const vapeV4 = {
    namespaced: true,
    state() {
        return {
            curStep: 1,
            previousStep: 1,
            isContinueDisabled: true,
            isUserAuthenticated: false,
            disabledTopNav: false,
            V4Permanent: {
                product: 1,
                productId: 3,
                name: 'perm',
                price: '34.99',
                price_old: false,
                selected: true,
                recurring: false,
                purchased: false,
                authorizeCode: 1,
                payPalCode: 'VQR98QRG99Y5J',
                citConCode: '3',
                amazonCode: '3',
                tebexCode: '1'
            },
            codePurchase: {
                product: 1,
                productId: 6,
                name: 'codePurchase',
                price: '34.99',
                price_old: false,
                selected: false,
                recurring: false,
                purchased: false,
                authorizeCode: 2,
                payPalCode: 'VQR98QRG99Y5J',
                citConCode: '6',
                amazonCode: '6',
                tebexCode: '2'
            },
            V4Subscription: {
                product: 1,
                productId: 7,
                name: 'sub',
                price: '0',
                price_old: false,
                selected: false,
                recurring: true,
                purchased: false,
                paused: false,
                authorizeCode: 999,
                tebexCode: ''
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
                    enabled: true
                },
                aliPay: {
                    name: 'AliPay',
                    enabled: true
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
        proceedToNextStep(state) {
            if (state.curStep === 1 && !state.isUserAuthenticated) {
                state.curStep = 2;
            } else if (state.curStep === 1 && state.isUserAuthenticated) {
                state.curStep = 3;
            } else if (state.curStep < 3) {
                state.curStep++;
            }
        },
        enableNextStep(state) {
            state.isContinueDisabled = false;
        },
        disableNextStep(state) {
            state.isContinueDisabled = true;
        },
        selectSubscription(state) {
            state.V4Subscription.selected = true;
            state.V4Permanent.selected = false;
        },
        selectPermanent(state) {
            state.V4Permanent.selected = true;
            state.V4Subscription.selected = false;
        },
        authenticateUser(state, user) {
            state.isUserAuthenticated = true;
            state.user = { ...user };

            state.possiblePaymentTypes.card.enabled = false;
            state.possiblePaymentTypes.weChat.enabled = false;
        },
        setPaymentOptions(state) {
            if (state.V4Permanent.selected === true) {
                for (const [key, val] of Object.entries(state.possiblePaymentTypes)) {
                    val.enabled = true;
                }
            } else {
                for (const [key, val] of Object.entries(state.possiblePaymentTypes)) {
                    val.enabled = key === 'stripe' || key === 'payPal';
                }
            }
            state.possiblePaymentTypes.card.enabled = false;
            state.possiblePaymentTypes.weChat.enabled = false;
        },
        bindRegisterInputsToRegisterObject(state, payload) {
            state.registerObj = { ...payload };
        },
        clearRegisterObjPassword(state) {
            delete state.registerObj.password;
        },
        updateSubsPrice(state, price) {
            state.V4Subscription.price = price;
        },
        updatePermanentPrice(state, price) {
            state.V4Permanent.price = price;
        },
        updateSubsPriceOld(state, price) {
            state.V4Subscription.price_old = price;
        },
        updatePermanentPriceOld(state, price) {
            state.V4Permanent.price_old = price;
        },
        pendingPayment(state) {
            state.pendingPaymentRequest = true;
        },
        successResponse(state) {
            state.pendingPaymentRequest = false;
            state.successResponse = true;
        },
        setStep(state, step) {
            if (step > 0 && step < 4) {
                state.previousStep = state.curStep;
                state.curStep = step;
                if (state.curStep === 1 && state.isContinueDisabled === true) {
                    state.isContinueDisabled = false;
                }
            }
        },
        goBack(state) {
            if (state.previousStep === 2 && state.user.id !== '') {
                state.curStep = 1;
            }
            state.curStep = state.previousStep;
        },
        setSubscriberStatus(state) {
            state.V4Subscription.purchased = true;
            state.V4Subscription.selected = false;
            state.V4Permanent.selected = true;
        },
        setHasPermanent(state) {
            state.V4Subscription.purchased = true;
            state.V4Permanent.purchased = true;
            state.V4Permanent.selected = false;
            state.V4Subscription.selected = false;
            state.disabledTopNav = true;
        },
        setHasPaused(state) {
            state.V4Subscription.paused = true;
        }
    },
    getters: {
        selectedProduct(state) {
            return state.V4Subscription.selected ? state.V4Subscription : state.V4Permanent;
        }
    }
};

export default vapeV4;
