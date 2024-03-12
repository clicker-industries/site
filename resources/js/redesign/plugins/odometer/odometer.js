(function () {
    var VALUE_HTML = '<span class="odometer-value"></span>';
    var RIBBON_HTML = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + VALUE_HTML + '</span></span>';
    var DIGIT_HTML = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + RIBBON_HTML + '</span></span>';
    var FORMAT_MARK_HTML = '<span class="odometer-formatting-mark"></span>';
    var DIGIT_FORMAT = '(,ddd).dd';
    var MIN_INTEGER_LEN = 0;
    var FORMAT_PARSER = /^\(?([^)]*)\)?(?:(.)(D*)(d*))?$/;
    var FRAMERATE = 30;
    var DURATION = 2000;
    var COUNT_FRAMERATE = 20;
    var FRAMES_PER_VALUE = 2;
    var DIGIT_SPEEDBOOST = 0.5;
    var MS_PER_FRAME = 1000 / FRAMERATE;
    var COUNT_MS_PER_FRAME = 1000 / COUNT_FRAMERATE;
    var TRANSITION_END_EVENTS = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
    var transitionCheckStyles = document.createElement('div').style;
    var TRANSITION_SUPPORT = transitionCheckStyles.transition != null || transitionCheckStyles.webkitTransition != null || transitionCheckStyles.mozTransition != null || transitionCheckStyles.oTransition != null;
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    function createFromHTML(html) {
        var el = document.createElement('div');
        el.innerHTML = html;
        return el.children[0];
    }

    function removeClass(el, name) {
        el.className = el.className.replace(new RegExp("(^| )" + name.split(' ').join('|') + "( |$)", 'gi'), ' ');
    }

    function addClass(el, name) {
        removeClass(el, name);
        el.className += " " + name;
    }

    function trigger(el, name) {
        var evt;
        if (document.createEvent != null) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(name, true, true);
            el.dispatchEvent(evt);
        }
    }

    function now() {
        return window.performance?.now?.() ?? +new Date();
    }

    function round(val, precision = 0) {
        if (!precision) {
            return Math.round(val);
        }
        val *= Math.pow(10, precision);
        val += 0.5;
        val = Math.floor(val);
        return val / Math.pow(10, precision);
    }

    function truncate(val) {
        return val < 0 ? Math.ceil(val) : Math.floor(val);
    }

    var _jQueryWrapped = false;

    function wrapJQuery() {
        if (_jQueryWrapped || !window.jQuery) {
            return;
        }
        _jQueryWrapped = true;
        ['html', 'text'].forEach(property => {
            var old = window.jQuery.fn[property];
            window.jQuery.fn[property] = function (val) {
                if (val == null || !this[0]?.odometer) {
                    return old.apply(this, arguments);
                }
                return this[0].odometer.update(val);
            };
        });
    }
    setTimeout(wrapJQuery, 0);

    class Odometer {
        constructor(options) {
            this.options = options;
            this.el = this.options.el;
            if (this.el.odometer != null) {
                return this.el.odometer;
            }
            this.el.odometer = this;
            this.MAX_VALUES = this.options.duration / MS_PER_FRAME / FRAMES_PER_VALUE | 0;
            this.resetFormat();
            this.value = this.cleanValue(this.options.value ?? '');
            this.renderInside();
            this.render();
            try {
                ['innerHTML', 'innerText', 'textContent'].forEach(property => {
                    if (this.el[property] != null) {
                        Object.defineProperty(this.el, property, {
                            get: () => {
                                if (property === 'innerHTML') {
                                    return this.inside.outerHTML;
                                } else {
                                    return this.inside.innerText ?? this.inside.textContent;
                                }
                            },
                            set: val => this.update(val)
                        });
                    }
                });
            } catch (e) {
                this.watchForMutations();
            }
        }

        renderInside() {
            this.inside = document.createElement('div');
            this.inside.className = 'odometer-inside';
            this.el.innerHTML = '';
            this.el.appendChild(this.inside);
        }

        watchForMutations() {
            if (!MutationObserver) {
                return;
            }
            try {
                if (!this.observer) {
                    this.observer = new MutationObserver(mutations => {
                        var newVal = this.el.innerText;
                        this.renderInside();
                        this.render(this.value);
                        this.update(newVal);
                    });
                }
                this.watchMutations = true;
                this.startWatchingMutations();
            } catch (e) {}
        }

        startWatchingMutations() {
            if (this.watchMutations) {
                this.observer.observe(this.el, {
                    childList: true
                });
            }
        }

        stopWatchingMutations() {
            this.observer?.disconnect();
        }

        cleanValue(val) {
            if (typeof val === 'string') {
                val = val.replace(this.format.radix ?? '.', '<radix>');
                val = val.replace(/[.,]/g, '');
                val = val.replace('<radix>', '.');
                val = parseFloat(val, 10) || 0;
            }
            return round(val, this.format.precision);
        }

        bindTransitionEnd() {
            if (this.transitionEndBound) {
                return;
            }
            this.transitionEndBound = true;
            var renderEnqueued = false;
            TRANSITION_END_EVENTS.split(' ').forEach(event => {
                this.el.addEventListener(event, () => {
                    if (renderEnqueued) {
                        return true;
                    }
                    renderEnqueued = true;
                    setTimeout(() => {
                        this.render();
                        renderEnqueued = false;
                        trigger(this.el, 'odometerdone');
                    }, 0);
                    return true;
                }, false);
            });
        }

        resetFormat() {
            var parsed = FORMAT_PARSER.exec(this.options.format ?? DIGIT_FORMAT);
            if (!parsed) {
                throw new Error("Odometer: Unparsable digit format");
            }
            var [, repeating, radix, fractional1, fractional2] = parsed.slice(1, 5);
            var fractional = (fractional1?.length ?? 0) + (fractional2?.length ?? 0) ?? 0;
            this.format = {
                repeating: repeating,
                radix: radix,
                precision: fractional,
                fractional: fractional1?.length ?? 0
            };
        }

        render(value) {
            if (value == null

) {
                value = this.value;
            }
            this.stopWatchingMutations();
            this.resetFormat();
            this.inside.innerHTML = '';
            var theme = this.options.theme;
            var classes = this.el.className.split(' ').filter(cls => !!cls);
            classes.push('odometer', TRANSITION_SUPPORT ? '' : 'odometer-no-transitions', theme ? `odometer-theme-${theme}` : 'odometer-auto-theme');
            this.el.className = classes.join(' ');
            this.ribbons = {};
            this.formatDigits(value);
            this.startWatchingMutations();
        }

        formatDigits(value) {
            var valueString = this.options.formatFunction ? this.options.formatFunction(value) : value.toString();
            var digits = valueString.split('').reverse();
            digits.forEach(valueDigit => {
                if (valueDigit.match(/[0-9]/)) {
                    var digit = this.renderDigit();
                    digit.querySelector('.odometer-value').innerHTML = valueDigit;
                    this.digits.push(digit);
                    this.insertDigit(digit);
                } else {
                    this.addSpacer(valueDigit);
                }
            });
        }

        update(newValue) {
            newValue = this.cleanValue(newValue);
            var diff = newValue - this.value;
            if (!diff) {
                return;
            }
            removeClass(this.el, 'odometer-animating-up odometer-animating-down odometer-animating');
            if (diff > 0) {
                addClass(this.el, 'odometer-animating-up');
            } else {
                addClass(this.el, 'odometer-animating-down');
            }
            this.stopWatchingMutations();
            this.animate(newValue);
            this.startWatchingMutations();
            setTimeout(() => {
                this.el.offsetHeight;
                addClass(this.el, 'odometer-animating');
            }, 0);
            this.value = newValue;
        }

        renderDigit() {
            return createFromHTML(DIGIT_HTML);
        }

        insertDigit(digit, before) {
            if (before != null) {
                this.inside.insertBefore(digit, before);
            } else if (!this.inside.children.length) {
                this.inside.appendChild(digit);
            } else {
                this.inside.insertBefore(digit, this.inside.children[0]);
            }
        }

        addSpacer(chr, before, extraClasses) {
            var spacer = createFromHTML(FORMAT_MARK_HTML);
            spacer.innerHTML = chr;
            if (extraClasses) {
                addClass(spacer, extraClasses);
            }
            this.insertDigit(spacer, before);
        }

        addDigit(value, repeating = true) {
            if (value === '-') {
                this.addSpacer(value, null, 'odometer-negation-mark');
            } else if (value === '.') {
                this.addSpacer(this.format.radix ?? '.', null, 'odometer-radix-mark');
            } else {
                if (repeating) {
                    while (this.format.repeating.length > 0) {
                        var chr = this.format.repeating.slice(-1);
                        this.format.repeating = this.format.repeating.slice(0, -1);
                        if (chr === 'd') {
                            break;
                        }
                        this.addSpacer(chr);
                    }
                }
                var digit = this.renderDigit();
                digit.querySelector('.odometer-value').innerHTML = value;
                this.digits.push(digit);
                this.insertDigit(digit);
            }
        }

        animate(newValue) {
            if (!TRANSITION_SUPPORT || this.options.animation === 'count') {
                this.animateCount(newValue);
            } else {
                this.animateSlide(newValue);
            }
        }

        animateCount(newValue) {
            var start = now();
            var cur = this.value;
            var tick = () => {
                if (now() - start > this.options.duration) {
                    this.value = newValue;
                    this.render();
                    trigger(this.el, 'odometerdone');
                    return;
                }
                var delta = now() - start;
                if (delta > COUNT_MS_PER_FRAME) {
                    start = now();
                    var fraction = delta / this.options.duration;
                    var dist = (newValue - cur) * fraction;
                    cur += dist;
                    this.render(Math.round(cur));
                }
                requestAnimationFrame ? requestAnimationFrame(tick) : setTimeout(tick, COUNT_MS_PER_FRAME);
            };
            tick();
        }

        animateSlide(newValue) {
            var oldValue = this.value;
            var fractionalCount = Math.max(this.format.fractional, this.getFractionalDigitCount(oldValue, newValue));
            if (fractionalCount) {
                newValue = Math.round(newValue * Math.pow(10, fractionalCount));
                oldValue = Math.round(oldValue * Math.pow(10, fractionalCount));
            }
            var diff = newValue - oldValue;
            if (!diff) {
                return;
            }
            this.bindTransitionEnd();
            var digitCount = Math.max(this.getDigitCount(oldValue, newValue), (this.options.minIntegerLen ?? MIN_INTEGER_LEN) + fractionalCount);
            var

 digits = [];
            var boosted = 0;
            for (var i = 0; i < digitCount; i++) {
                var start = truncate(oldValue / Math.pow(10, digitCount - i - 1));
                var end = truncate(newValue / Math.pow(10, digitCount - i - 1));
                var dist = end - start;
                var frames;
                if (Math.abs(dist) > this.MAX_VALUES) {
                    frames = [];
                    var incr = dist / (this.MAX_VALUES + this.MAX_VALUES * boosted * DIGIT_SPEEDBOOST);
                    var cur = start;
                    while (dist > 0 && cur < end || dist < 0 && cur > end) {
                        frames.push(Math.round(cur));
                        cur += incr;
                    }
                    if (frames[frames.length - 1] !== end) {
                        frames.push(end);
                    }
                    boosted++;
                } else {
                    frames = Array.from({length: Math.abs(dist) + 1}, (_, index) => dist > 0 ? start + index : start - index);
                }
                digits.push(Array.from(frames.toString()).map(digit => parseInt(digit)));
            }
            this.resetDigits();
            digits.reverse().forEach((frames, i) => {
                if (!this.digits[i]) {
                    this.addDigit(' ', i >= fractionalCount);
                }
                if (!this.ribbons[i]) {
                    this.ribbons[i] = this.digits[i].querySelector('.odometer-ribbon-inner');
                }
                this.ribbons[i].innerHTML = '';
                if (diff < 0) {
                    frames.reverse();
                }
                frames.forEach((frame, j) => {
                    var numEl = document.createElement('div');
                    numEl.className = 'odometer-value';
                    numEl.innerHTML = frame;
                    this.ribbons[i].appendChild(numEl);
                    if (j === frames.length - 1) {
                        addClass(numEl, 'odometer-last-value');
                    }
                    if (j === 0) {
                        addClass(numEl, 'odometer-first-value');
                    }
                });
            });
            if (oldValue < 0) {
                this.addDigit('-');
            }
            var mark = this.inside.querySelector('.odometer-radix-mark');
            if (mark != null) {
                mark.parent.removeChild(mark);
            }
            if (fractionalCount) {
                this.addSpacer(this.format.radix ?? '.', this.digits[fractionalCount - 1], 'odometer-radix-mark');
            }
        }

        static init() {
            if (!document.querySelectorAll) {
                return;
            }
            var elements = document.querySelectorAll(Odometer.options.selector || '.odometer');
            elements.forEach(el => {
                el.odometer = new Odometer({
                    el: el,
                    value: el.innerText ?? el.textContent
                });
            });
        }
    }

    if (document.documentElement?.doScroll && document.createEventObject) {
        var _old = document.onreadystatechange;
        document.onreadystatechange = function () {
            if (document.readyState === 'complete' && Odometer.options.auto !== false) {
                Odometer.init();
            }
            return _old ? _old.apply(this, arguments) : void 0;
        };
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            if (Odometer.options.auto !== false) {
                Odometer.init();
            }
        }, false);
    }

}).call(this);
