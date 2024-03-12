import './bootstrap';

$(document).ready(function () {
    $(".slider-768").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        speed: 700,
        arrows: false,
        dots: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        pauseOnDotsHover: true,
        draggable: false,
        infinite: true,
        swipe: true,
        touchMove: true,
        responsive: [{
            breakpoint: 767, settings: {
                slidesToShow: 1, autoplay: false, slidesToScroll: 1
            }
        }]
    });

    var dlNotification = $(".sm-slider.dl-notification");

    function toggleNotification(notification) {
        var windowWidth = $(window).width();
        if (notification !== undefined && notification.is(":visible")) {
            if (windowWidth < 768) {
                if (!notification.hasClass("slick-initialized")) {
                    notification.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        speed: 700,
                        arrows: true,
                        dots: false,
                        swipe: true,
                        touchMove: true,
                        infinite: false
                    });
                }
            } else {
                if (notification.hasClass("slick-initialized")) {
                    notification.slick("unslick");
                }
            }
        }
    }

    function collapsePoints() {
        window.points.forEach(function (point) {
            point.classList.remove("opened");
            var btn = point.querySelector(".point_btn");
            var answer = point.querySelector(".point_answer");
            if (answer !== null) {
                btn.classList.remove("active");
                $(answer).slideUp();
            }
        });
    }

    toggleNotification(dlNotification);

    $(document).on("click", ".btn_close_section", function (e) {
        e.preventDefault();
        $(this).parents(".header-download").slideUp(300);
        localStorage.setItem("dwnl-ntf", "closed");
    }).on("click", ".dl_btn", function (e) {
        if (localStorage.getItem("dwnl-ntf") !== "closed") {
            $(".header-download").slideDown(300);
        }
    });

    $(window).on("resize", function () {
        toggleNotification(dlNotification);
    });

    $(document).on('click', '.header_burger>.touchable', function (e) {
        e.preventDefault();
        var hB = $(this).parents('.header_burger');
        hB.toggleClass('active').next().toggleClass('active');
        $('body').toggleClass('lock');
    });

    $(document).on('scroll', function (e) {
        var header_height = $('header').scrollTop();
        if ($(window).scrollTop() > header_height) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    $(document).on('click', '.question_text', function (e) {
        e.preventDefault();
        $(this).next().find('.question_btn').toggleClass('active');
        $(this).toggleClass('active');
        $(this).next().next().slideToggle();
    });

    /*Features auto accordion*/
    window.interval = null;
    window.intervalTime = 7200;
    window.featuresIterator = 0;
    window.points = document.querySelectorAll('.point');
    window.pointsWrapper = document.querySelector('.compare_points');

    function clearIntervalAndId() {
        clearInterval(window.interval);
        window.interval = null;
    }

    function closeAllFeaturesPoints() {
        window.points.forEach(function (point) {
            point.classList.remove('opened');
            var btn = point.querySelector('.point_btn');
            var answer = point.querySelector('.point_answer');
            var slider = point.querySelector('.point-slider');
            if (typeof answer !== 'undefined' && answer !== null) {
                btn.classList.remove('active');
                $(answer).slideUp();
                /* on features, the auto-opening timer on the sections | progressbar
                if (slider !== null && typeof slider !== 'undefined') {
                    Velocity(slider, {width: '0'}, {duration: 100, easing: 'ease'})
                }
                */
            }
        });
    }

    function openFeaturePoint(node) {
        closeAllFeaturesPoints();
        var btn = node.querySelector('.point_btn');
        var answer = node.querySelector('.point_answer');
        var slider = node.querySelector('.point-slider');
        node.classList.add('opened');
        if (typeof answer !== 'undefined' && answer !== null) {
            btn.classList.add('active');
            $(answer).slideDown();
            /* on features, the auto-opening timer on the sections | progressbar
            if (slider !== null && typeof slider !== 'undefined') {
                Velocity(slider, {width: '100%'}, {duration: window.intervalTime, easing: 'linear'})
            }
            */
        }
    }

    /* on features, the auto-opening timer on the sections | on page load
    window.clearIntervalAndId = clearIntervalAndId;
    window.closeAllFeaturesPoints = closeAllFeaturesPoints;
    window.openFeaturePoint = openFeaturePoint;
     if (window.points.length) {
        if (window.featuresIterator > window.points.length - 1) {
            window.featuresIterator = 0;
        }
        openFeaturePoint(window.points[window.featuresIterator]);
        window.featuresIterator++;
        window.interval = setInterval(function () {
            if (window.featuresIterator > window.points.length - 1) {
                window.featuresIterator = 0;
            }
            openFeaturePoint(window.points[window.featuresIterator]);
            window.featuresIterator++;
        }, window.intervalTime)
    }
    */

    $(document).on('click', '.point', function (e) {
        e.preventDefault();
        clearIntervalAndId();
        if (this.classList.contains('opened')) {
            closeAllFeaturesPoints();
            var index = Array.prototype.indexOf.call(window.points, this);
            /* on features, the auto-opening timer on the sections | on open one of
            index++;
            window.interval = setInterval(function () {
                if (index > window.points.length - 1) {
                    index = 0;
                }
                openFeaturePoint(window.points[index]);
                index++;
            }, window.intervalTime);
            */
        } else {
            var _index = Array.prototype.indexOf.call(window.points, this);
            openFeaturePoint(window.points[_index]);
            /* on features, the auto-opening timer on the sections | on open one of
            index++;
            window.interval = setInterval(function () {
                if (index > window.points.length - 1) {
                    index = 0;
                }
                openFeaturePoint(window.points[index]);
                index++;
            }, window.intervalTime);
            */
        }
    });
});


/* on features, the auto-opening timer on the sections | on scroll
window.onload = function () {
    if(window.pointsWrapper) {
        document.addEventListener('scroll', function () {
            if(window.isElementInViewport(window.pointsWrapper)) {
                if(window.interval === null) {
                    let $openedPoint = $('.point.opened');
                    if($openedPoint.length !== 1) {
                        $openedPoint = $($('.point').get(0));
                    }
                    let index = Array.prototype.indexOf.call(window.points, $openedPoint.get(0));
                    index++;
                    openFeaturePoint(window.points[index]);
                    index++;
                    window.interval = setInterval(function () {
                        if (index > window.points.length - 1) {
                            index = 0;
                        }
                        openFeaturePoint(window.points[index]);
                        index++;
                    }, window.intervalTime);
                }
            } else {
                clearIntervalAndId();
            }
        }, { passive: true })

        $(window).blur(function(){
            clearIntervalAndId();
        });
        $(window).focus(function(){
            if(window.isElementInViewport(window.pointsWrapper)) {
                if(window.interval === null) {
                    let $openedPoint = $('.point.opened');
                    if($openedPoint.length !== 1) {
                        $openedPoint = $($('.point').get(0));
                    }
                    let index = Array.prototype.indexOf.call(window.points, $openedPoint.get(0));
                    index++;
                    openFeaturePoint(window.points[index]);
                    index++;
                    window.interval = setInterval(function () {
                        if (index > window.points.length - 1) {
                            index = 0;
                        }
                        openFeaturePoint(window.points[index]);
                        index++;
                    }, window.intervalTime);
                }
            }
        });
    }

}
*/

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop + 114 + 44 && elementTop < viewportBottom;
};

$(document).ready(function () {
    var enableScrollSpy = true;
    $(document).on('click', '.table_btn', function (e) {
        enableScrollSpy = false;
        setTimeout(function () {
            enableScrollSpy = true;
        }, 1000);
        e.preventDefault();
        if ($(this).find('.table_button').hasClass('active')) {
            return;
        }
        var table = $(this).find('.table_button').attr('data-table');
        $('.table_button').removeClass('active');
        $(this).find('.table_button').addClass('active');
    });

    // features side panel - update selected index
    setTimeout(function () {
        $(window).on('resize scroll', function () {
            if (enableScrollSpy === false) return;
            $('.table_menu li a').each(function () {
                var id = $(this).attr('href');
                if ($(id).isInViewport()) {
                    $('.table_menu li a').removeClass('active');
                    $(this).addClass('active');
                    return false;
                }
            });
        });
    }, 500);
});
$(document).ready(function () {
    $(document).on('click', '.artwork', function (e) {
        e.preventDefault();
        var $self = $(this);
        $('.artwork.active').removeClass('active');
        $self.addClass('active');
    });
    $(document).on('click', function (e) {
        var $openedFeaturesImages = $('.artwork.active');
        if ($openedFeaturesImages) {
            if (!$(e.target).hasClass('img_art') && !$(e.target).hasClass('artwork')) {
                $openedFeaturesImages.removeClass('active');
            }
        }
    });
    $(document).on('click', '.s_i', function (e) {
        e.preventDefault();
        if ($(this).next().hasClass('active')) {
            $(this).next().removeClass('active');
            return;
        }
        $('.sub_info_info').removeClass('active');
        $(this).next().addClass('active');
    }).on('click', '.arrow', function (e) {
        e.preventDefault();
        $(this).prev().find(".sub_help").toggleClass('active');
    }).on('click', '.help_btn', function (e) {
        e.preventDefault();
        $(this).next().toggleClass('active');
    }).on('click', '.btn_close', function (e) {
        e.preventDefault();
        $('.sub_notification').slideUp(300);
    }).on('click', '.sub_info_btn', function (e) {
        e.preventDefault();
        if ($(this).find('.sub_info').hasClass('active')) {
            $(this).find('.sub_info').removeClass('active');
            return;
        }
        $('.sub_info').removeClass('active');
        $(this).find('.sub_info').addClass('active');
    }).on('click', '.arrow_slide', function (e) {
        e.preventDefault();
        $(this).toggleClass('closed').parent().next().slideToggle();
    });
    $('.select').each(function () {
        var _this = $(this), selectOption = _this.find('option'), selectOptionLength = selectOption.length,
            selectedOption = selectOption.filter(':selected'), duration = 300;
        _this.hide();
        _this.wrap('<div class="select"></div>');
        $('<div>', {
            "class": 'new-select', text: _this.children('option:disabled').text()
        }).insertAfter(_this);
        var selectHead = _this.next('.new-select');
        $('<div>', {
            "class": 'new-select__list'
        }).insertAfter(selectHead);
        var selectList = selectHead.next('.new-select__list');
        for (var i = 1; i < selectOptionLength; i++) {
            $('<div>', {
                "class": 'new-select__item', html: $('<span>', {
                    text: selectOption.eq(i).text()
                })
            }).attr('data-value', selectOption.eq(i).val()).appendTo(selectList);
        }
        var selectItem = selectList.find('.new-select__item');
        selectList.slideUp(0);
        selectHead.on('click', function (e) {
            e.stopPropagation();
            if (!$(this).hasClass('on')) {
                $(this).addClass('on');
                selectList.slideDown(duration);
                selectItem.on('click', function () {
                    var chooseItem = $(this).data('value');
                    $('select').val(chooseItem).attr('selected', 'selected');
                    selectHead.text($(this).find('span').text());
                    selectList.slideUp(duration);
                    selectHead.removeClass('on');
                });
            } else {
                $(this).removeClass('on');
                selectList.slideUp(duration);
            }
        });
    });
    $(document).on('click', function (e) {
        var selectList = $('.new-select__list');
        if (selectList.length > 0) {
            selectList.each(function (index, selectOptionsDiv) {
                var $jq_select = $(selectOptionsDiv);
                if (!$(e.target).hasClass('.new-select__list') && $jq_select.is(":visible")) {
                    $jq_select.parents('.select').find('.new-select').removeClass('on');
                    $jq_select.slideUp(300);
                }
            });
        }
    });
    /*my account input focus*/
    $(document).on('focus', '.account-action-form-input-container input', function (e) {
        var $slider = $(this).parent('.account-action-form-input-container').find('.input-slider');
        if ($slider.length) {
            Velocity($slider, {
                width: '100%'
            }, {
                duration: 300, easing: 'ease'
            });
        }
    });
    $(document).on('blur', '.account-action-form-input-container input', function (e) {
        var $slider = $(this).parent('.account-action-form-input-container').find('.input-slider');
        if ($slider.length) {
            Velocity($slider, {
                width: 0
            }, {
                duration: 300, easing: 'ease'
            });
        }
    });

    /*2FA animated modal*/

    var faInput = document.querySelector('.fa_code');
    if (faInput) {
        var inputMask2FA = new window.Inputmask('999 999', {
            "placeholder": "x", outputFormat: '999999'
        });
        inputMask2FA.mask(faInput);
    }

    function show2FAmodal() {
        var modal = document.querySelector('.fa_window');
        var overlay = document.querySelector('.overlay_window');
        //TODO: is '.lock' to body needed?
        //document.body.classList.add('lock');
        var animationSettings = {
            duration: 200, easing: 'ease'
        };
        overlay.classList.add('active');
        modal.classList.add('active');
        Velocity(overlay, {
            opacity: 1
        }, animationSettings);
        Velocity(modal, {
            opacity: 1, transform: ["translate(-50%, -50%)", "translate(-50%, -45%)"]
        }, animationSettings);
    }

    function close2FAmodal() {
        var modal = document.querySelector('.fa_window');
        var overlay = document.querySelector('.overlay_window');
        var qrImage = document.querySelector('.qr_img img');
        var qrSecret = document.querySelector('.qr_code');
        //TODO: is '.lock' to body needed?
        //document.body.classList.remove('lock');
        var animationSettings = {
            duration: 200, easing: 'ease'
        };
        Velocity(overlay, {
            opacity: 0
        }, animationSettings);
        Velocity(modal, {
            opacity: 0, transform: ["translate(-50%, -45%)", "translate(-50%, -50%)"]
        }, animationSettings).then(function () {
            overlay.classList.remove('active');
            modal.classList.remove('active');
        });
        faInput.value = '';
        /*qrImage.src = '/img/qr.png';
        qrSecret.innerText = ''*/
    }

    $(document).on('click', '.btn_enable.enable_qr', function (e) {
        e.preventDefault();
        var qrImage = document.querySelector('.qr_img img');
        var qrSecret = document.querySelector('.qr_code');
        window.axios.get('/2fa/enable').then(function (res) {
            if (res.data.secret.length) {
                qrImage.src = res.data.image;
                qrSecret.innerText = res.data.secret;
                show2FAmodal();
            }
        })["catch"](function (err) {
            console.log(err.message);
        });
    }).on('click', '.btn_enable.disable_qr', function (e) {
        e.preventDefault();
        window.axios.get('/2fa/disable').then(function (res) {
            if (res.data.status === 'success') {
                var twoFAInfo = document.querySelector('.two-fa-value');
                var twoFABtn = document.querySelector('.btn_enable.disable_qr');
                var animationSettings = {
                    duration: 300, easing: 'ease'
                };
                Velocity(twoFAInfo, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    twoFAInfo.innerText = 'Disabled';
                    Velocity(el, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
                Velocity(twoFABtn, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    twoFABtn.innerText = 'Enable';
                    twoFABtn.classList.remove('disable_qr');
                    twoFABtn.classList.add('enable_qr');
                    Velocity(el, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
            }
        })["catch"](function (err) {
        });
    }).on('click', '.blue_btn.two-fa-submit', function (e) {
        e.preventDefault();
        var qrSecret = document.querySelector('.qr_code');
        var totpInput = document.querySelector('.fa_code');
        var formData = new FormData();
        formData.append('secret', qrSecret.innerText);
        formData.append('totp', totpInput.value.replace(/\s+/i, ''));
        window.axios.post('/2fa/enable', formData).then(function (res) {
            if (res.data.status === 'success') {
                var twoFAInfo = document.querySelector('.two-fa-value');
                var twoFABtn = document.querySelector('.btn_enable.enable_qr');
                twoFAInfo.innerText = 'Enabled';
                twoFABtn.innerText = 'Disable';
                twoFABtn.classList.remove('enable_qr');
                twoFABtn.classList.add('disable_qr');
                close2FAmodal();
            }
        })["catch"](function (err) {
            console.log(err.message);
        });
    }).on('click', '.overlay_window', function () {
        close2FAmodal();
    });

    /*Enable / Disable account */

    $(document).on('click', '.btn_enable.enable_temp_dis', function (e) {
        e.preventDefault();
        var tempDisabledInfo = document.querySelector('.temp-dis-val');
        var tempDisabledBtn = document.querySelector('.btn_enable.enable_temp_dis');
        var url = '/user/disable';
        window.axios.post(url).then(function (res) {
            if (res.data.status === 'success') {
                var animationSettings = {
                    duration: 300, easing: 'ease'
                };
                Velocity(tempDisabledInfo, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    tempDisabledInfo.innerText = 'Turned on';
                    Velocity(elements, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
                Velocity(tempDisabledBtn, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    tempDisabledBtn.innerText = 'Disable';
                    tempDisabledBtn.classList.remove('enable_temp_dis');
                    tempDisabledBtn.classList.add('disable_temp_dis');
                    Velocity(elements, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
            }
        })["catch"](function (err) {
            return console.log(err.message);
        });
    }).on('click', '.btn_enable.disable_temp_dis', function (e) {
        e.preventDefault();
        var tempDisabledInfo = document.querySelector('.temp-dis-val');
        var tempDisabledBtn = document.querySelector('.btn_enable.disable_temp_dis');
        var url = '/user/enable';
        window.axios.post(url).then(function (res) {
            if (res.data.status === 'success') {
                var animationSettings = {
                    duration: 300, easing: 'ease'
                };
                Velocity(tempDisabledInfo, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    tempDisabledInfo.innerText = 'Turned off';
                    Velocity(elements, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
                Velocity(tempDisabledBtn, {
                    opacity: 0
                }, animationSettings).then(function (elements) {
                    tempDisabledBtn.innerText = 'Enable';
                    tempDisabledBtn.classList.remove('disable_temp_dis');
                    tempDisabledBtn.classList.add('enable_temp_dis');
                    Velocity(elements, {
                        opacity: 1
                    }, animationSettings);
                })["catch"](function (err) {
                    return console.log(err.message);
                });
            }
        })["catch"](function (err) {
            return console.log(err.message);
        });
    });

    /*update ip*/
    $(document).on('click', '.value.ip_value .btn_update', function (e) {
        e.preventDefault();
        var button = e.target;
        var message = document.querySelector('.value.ip_value .ip_message');
        var icon = document.querySelector('.value.ip_value .img_ip');
        button.innerText = 'Updating...';
        var durationSettings = {
            duration: 300, easing: 'ease'
        };
        window.axios.get('/account/update-ip').then(function (res) {
            if (res.data.status === 'success') {
                Velocity(icon, {
                    opacity: 0, width: 0, flexBasis: 0
                }, durationSettings);
                Velocity(button, {
                    opacity: 0, width: 0, flexBasis: 0
                }, durationSettings);
                message.classList.add('success');
                message.innerText = 'Your IP is up to date';
            }
        })["catch"](function (err) {
            console.log(err.message);
        });
    });

    /*scroll to*/
    $(document).on("click", ".table_button, .scroll-to", function (event) {
        event.preventDefault();
        var id = $(this).attr('href');
        if (id.length) {
            var _el = $(id);
            if (_el.length) {
                var top = _el.offset().top - 120;
                $('html, body').animate({
                    scrollTop: top
                }, 500);
            }
        }
    });

    /*pop-up*/
    $(document).on('click', '.popup_open', function (e) {
        e.preventDefault();
        $('.popup_wrapper').addClass('active');
    }).on('click', '.popup_close', function (e) {
        e.preventDefault();
        $('.popup_wrapper').removeClass('active');
    }).on('click', '.popup_wrapper', function (e) {
        if ($(e.target).closest('.code_form').length != 0) {
            if (!$(e.target).is(":button")) {
                return false;
            }
        } else {
            $('.popup_wrapper').removeClass('active');
        }
    });
    $(document).on('click', '#license_agreement_popup .popup_close', function (e) {
        e.preventDefault();
        window.location.replace('/');
    }).on('click', '#eula-submit', function (e) {
        e.preventDefault();
        window.axios.post('/user/eula-agree').then(function (res) {
            window.location.reload();
        });
    });
    $(document).on('click', '#account_unlock_button', function (e) {
        e.preventDefault();
        var email = $(this).data('email');
        window.axios.post('/account/unlock-shared').then(function (res) {
            var message = "Please check your email ".concat(email, " for instructions on how to unlock your account.");
            $('#account_locked_popup .textpage_content .container').html("<p>".concat(message, "</p>"));
            $('#account_locked_popup .submits-container').hide();
        })["catch"](function (err) {
            console.log(err.message);
        });
    });

    // Redeem Jido code
    $(document).on('click', '.redeem-jido-code', function (e) {
        e.preventDefault();
        window.axios.post('/user/redeem-jido-code').then(function (res) {
            $('#jido-redeem-row').remove();
        });
    });
    $(document).on('click', '#discount-code-submit', function (e) {
        e.preventDefault();
        var formData = new FormData();
        var code = $('#discount-code-input').val();
        formData.append('code', code);
        window.axios.post('/api/discounts/check-code', formData).then(function (res) {
            console.log(res.data);
            if (res.data.valid === "Y") {
                $('#discount-code-input').removeClass('invalid');
                $('.code_form').submit();
            } else {
                $('#discount-code-input').addClass('invalid');
            }
        })["catch"](function (err) {
            $('#discount-code-input').addClass('invalid');
            console.log(err.message);
        });
    });

    // Update discount code statistic on myaccount page
    $(document).on('click', '#dcs_form_submit', function (e) {
        e.preventDefault();
        $(this).addClass('disabled');
        var formData = new FormData();
        var start = $('#dcs_form_start').val();
        var end = $('#dcs_form_end').val();
        formData.append('start', start);
        formData.append('end', end);
        window.axios.post('/api/v2/user/discount-codes-statistic', formData).then(function (res) {
            $('#dc-stat-content').html(res.data);
            $('#dcs_form_submit').removeClass('disabled');
        })["catch"](function (err) {
            console.log(err.message);
        });
    });
    $(document).on('click', '.my_block.collapsible .title', function (e) {
        e.preventDefault();
        var block = $(this).parents('.my_block.collapsible');
        $('.coll_btn', block).toggleClass('active');
        $(this).toggleClass('active');
        $('.coll', block).slideToggle();
    });
});
window.odometerOptions = {
    auto: false, duration: 700, theme: 'default'
};
var odometerEl = document.getElementById('v-animated-odometer-1');
if (odometerEl !== null) {
    window.onload = function () {
        var odometerEl1 = document.getElementById('v-animated-odometer-1');
        window.od1 = new Odometer({
            el: odometerEl1, value: odometerEl1.dataset.init_val, format: '(dd).DD', theme: 'default'
        });
        var odometerEl2 = document.getElementById('v-animated-odometer-2');
        window.od2 = new Odometer({
            el: odometerEl2, value: odometerEl2.dataset.init_val, format: '(dd).DD', theme: 'default'
        });
    };
    var switcher = document.querySelectorAll('.od-switch');
    if (switcher !== null) {
        document.getElementById('subs_v4_price').addEventListener('click', animatedOdometerSwitch);
        document.getElementById('subs_lite_price').addEventListener('click', animatedOdometerSwitch);
    }
}

function animatedOdometerSwitch(e) {
    e.preventDefault();
    var elementSelector = this.dataset["for"];
    var el = document.getElementById('v-animated-odometer-' + elementSelector);
    var priceSub = document.getElementById('price-sub-ob-' + elementSelector);
    var self = this;
    if (el === null) {
        return false;
    }
    var priceText = '';
    var switcherText = '';
    var switchTo = el.dataset.switchto.toString();
    var sub = this.dataset.sub;
    var price_s = this.dataset.price_s;
    var price_p = this.dataset.price_p;
    var subsLiteOldPrice = document.getElementById("subs_old_price_" + elementSelector);
    if (sub !== 's') {
        this.dataset.sub = 's';
        window['od' + elementSelector].update(price_s);
        var d = el.querySelector('.odometer-digit:first-child');
        if (d !== null) {
            Velocity(d, {
                opacity: 0, width: 0
            }, {
                duration: 500
            });
        }
        el.dataset.switchto = price_p;
        priceText = '/ month';
        switcherText = 'Switch to one-time';
        if (subsLiteOldPrice) {
            subsLiteOldPrice.textContent = subsLiteOldPrice.dataset.price_s;
        }
    } else {
        this.dataset.sub = 'p';
        window['od' + elementSelector].update(price_p);
        var _d = el.querySelector('.odometer-digit:first-child');
        if (_d !== null) {
            Velocity(_d, {
                opacity: [1, 0], width: ['24px', 0]
            }, {
                duration: 500
            });
        }
        el.dataset.switchto = price_s;
        priceText = 'one-time purchase';
        switcherText = 'Switch to recurring';
        if (subsLiteOldPrice) {
            subsLiteOldPrice.textContent = subsLiteOldPrice.dataset.price_p;
        }
    }
    if (priceSub !== null && priceText.length) {
        Velocity(priceSub, {
            opacity: [0, 1], transform: ["translateX(20px)", "translateX(0)"]
        }, {
            duration: 250
        }).then(function () {
            priceSub.innerText = priceText;
            Velocity(priceSub, {
                opacity: [1, 0], transform: ["translateX(0)", "translateX(20px)"]
            }, {
                duration: 250
            });
        })["catch"](function (err) {
            return console.log(err);
        });
    }
    if (switcherText.length) {
        Velocity(self, {
            opacity: [0, 1]
        }, {
            duration: 500
        }).then(function () {
            self.innerText = switcherText;
            Velocity(self, {
                opacity: [1, 0]
            }, {
                duration: 500
            });
        })["catch"](function (err) {
            return console.log(err);
        });
    }
}

var copyCodeBtn = document.querySelector('.copy-code');
var codeInput = document.querySelector('.product-code-input');
if (copyCodeBtn !== null && codeInput !== null) {
    copyCodeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var text = codeInput.value;
        copyToClipboard(text);
    });
}
