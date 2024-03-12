// Import necessary modules
import isInViewPort from './plugins/isInViewPort';
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui.min.js';
import Inputmask from 'inputmask';
import Odometer from './plugins/odometer/odometer';
import copyToClipboard from './plugins/copyToClipBoard';

// Set up global variables
window._ = require('lodash');
window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
require('bootstrap');
require('@fancyapps/fancybox');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.Velocity = Velocity;
window.Inputmask = Inputmask;
window.Odometer = Odometer;
window.copyToClipboard = copyToClipboard;
window.isElementInViewport = isInViewPort;

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

