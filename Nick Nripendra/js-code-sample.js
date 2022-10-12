jQuery(document).ready(function ($) {
    // Slick Slider for Small Screens on Resize
    // const event = new EV
    // window.dispatchEvent()
    $(window).on('resize orientationchange', function () {
        $('.slider_slick').each(function () {
            var $carousel = $(this);
            if ($(window).width() > 1024) {
                if ($carousel.hasClass('slick-initialized')) {
                    $carousel.slick('unslick');
                }
            } else {
                if (!$carousel.hasClass('slick-initialized') && this.querySelectorAll('.card-small, .card_head-purple').length >= 2) {
                    $carousel.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        mobileFirst: true,
                        infinite: true,
                        speed: 500,
                        arrows: false,
                        centerMode: false,
                        autoplay: true,
                        // adaptiveHeight: true,
                        cssEase: 'linear',
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            }
        });

        // Slider Leadership
        $('.module_leadership .slider_slick').each(function () {
            var $carousel = $(this);
            if ($(window).width() > 1024) {
                if ($carousel.hasClass('slick-initialized')) {
                    $carousel.slick('unslick');
                }
            } else {
                if (!$carousel.hasClass('slick-initialized') && this.querySelectorAll('.card_profile').length >= 2) {
                    $carousel.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        mobileFirst: true,
                        infinite: false,
                        speed: 500,
                        arrows: false,
                        centerMode: false,
                        autoplay: false,
                        cssEase: 'linear',
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            }
        });

        // Slider Tabs
        $('.slider_tabs').each(function () {
            var $carousel = $(this);
            if ($(window).width() > 767) {
                if ($carousel.hasClass('slick-initialized')) {
                    $carousel.slick('unslick');
                }
            } else {
                if (!$carousel.hasClass('slick-initialized') && this.querySelectorAll('.tab-in').length >= 2) {
                    $carousel.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        mobileFirst: true,
                        infinite: true,
                        speed: 500,
                        arrows: false,
                        centerMode: false,
                        autoplay: true,
                        cssEase: 'linear'
                    });
                }
            }
        });

        // Tabs
        $('#tabs-nav li:first-child').addClass('active');
        $('.wrap_tabs .tab-content').hide();
        $('.wrap_tabs .tab-content:first').show();
        $('#tabs-nav li').click(function () {
            $('#tabs-nav li').removeClass('active');
            $(this).addClass('active');
            $('.wrap_tabs .tab-content').hide();
            var activeTab = $(this).find('a').attr('href');
            $(activeTab).show();
            return false;
        });

        // Press Tabs
        $('#pressTabs li:first-child').addClass('active');
        $('.wrap_press-tabs .tab-content').hide();
        $('.wrap_press-tabs .tab-content:first').show();
        $('#pressTabs li').click(function () {
            $('#pressTabs li').removeClass('active');
            $(this).addClass('active');
            $('.wrap_press-tabs .tab-content').hide();
            var activeTab = $(this).find('a').attr('href');
            $(activeTab).show();
            return false;
        });
    });

    // Testimonial Slider
    $('.slider_testimonials').each(function () {
        var $carousel = $(this);
        if (!$carousel.hasClass('slick-initialized') && this.querySelectorAll('.testimonial-info').length >= 2) {
            $carousel.slick({
                arrows: false,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                accessibility: true,
                autoplay: true,
                autoplaySpeed: 6000,
                dots: true,
                mobileFirst: true,
                centerMode: false,
                responsive: [
                    {
                        breakpoint: 767,
                        settings: {
                            arrows: true,
                        }
                    }
                ]
            });
        }
    });

    // Popup
    /**
     * Video Modal js
     * Created By: RubicoTech (Emily Ritika)
     * @package demo Genesis Collection
     */
    $(".btn-video").on("click", function () {
        var videoUrl = $(this).attr('data-videoUrl') + "?autoplay=1";
        var videoType = $(this).attr('data-videoType');
        $(".lightbox-wrapper").fadeIn(1000);
        $(this).hide();


        if (videoType == 'youtube' || videoType == 'vimeo') {

            //	if ($(window).width() > 960) {
            jQuery('.video-iframe').attr('src', videoUrl);
            jQuery('.video-iframe').attr('title', videoType);

            jQuery('.video-iframe').show();
            jQuery('.video-html5').hide();
        } else {
            jQuery('.video-html5').show();
            jQuery('.video-iframe').hide();
            jQuery('.video-html5').get(0).pause();
            jQuery('.video-html5 .mp4video').attr('src', videoUrl);
            jQuery('.video-html5 .mp4video').attr('type', videoType);
            jQuery('.video-html5').get(0).load();
            jQuery('.video-html5').get(0).play();
        }


    });
    $("#close-btn").on("click", function () {
        $(".lightbox-wrapper").fadeOut(500);
        $('.lightbox-wrapper iframe').attr('src', '');
        $('.lightbox-wrapper .video-html5').get(0).pause();
        $(".btn-video").show(250);
    });

    // search opener
    $(".search-open-with-item .search-opener").click(function () {
        $(this).toggleClass("active");
        $(".search-wrap .search-inner-wrap").toggleClass("active-search");
        // body overlay
        $("body").toggleClass("body-overlay");
    });

    $("body").click(function (e) {
        if ($(e.target).parent().find("#masthead").length === 1) {
            $(".search-open-with-item .search-opener").removeClass("active");
            $(".search-wrap .search-inner-wrap").removeClass("active-search");
            // body overlay
            $("body").removeClass("body-overlay");
        }
    })

    // Accordion
    $(".accordion_left .accor_set > a").on("click", function () {
        $(this).toggleClass("active");
        $(this).siblings(".accor_content").slideToggle(500);
    });
    $(".accordion_right .accor_set > a").on("click", function () {
        $(this).toggleClass("active");
        $(this).siblings(".accor_content").slideToggle(500);
    });
    $('.wrap_accordion.first_opened .accor_set:first-child a').each(function (index, ele) {
        $(ele).click();
    });

    // Set Time Out for Admin
    $(window).on('load resize orientationchange', function () {
        // SetTimeOut for Tabs and Eyebrow Animation
        setTimeout(function () {
            // Eyebrow Animation
            const inViewport = (entries, observer) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
                });
            };
            const Obs = new IntersectionObserver(inViewport);
            const obsOptions = {};
            // Attach observer to every [data-inviewport] element:
            const ELs_inViewport = document.querySelectorAll('[data-inviewport]');
            ELs_inViewport.forEach(EL => {
                Obs.observe(EL, obsOptions);
            });

            // Testimonial Slider for Admin
            $('.slider_testimonials').each(function () {
                var $carousel = $(this);
                if (!$carousel.hasClass('slick-initialized') && this.querySelectorAll('.testimonial-info').length >= 2) {
                    $carousel.slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        accessibility: true,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        dots: true,
                        mobileFirst: true,
                        centerMode: false,
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: true,
                                }
                            }
                        ]
                    });
                }
            });
            // Press Tabs
            $('#pressTabs li:first-child').addClass('active');
            $('.wrap_press-tabs .tab-content').hide();
            $('.wrap_press-tabs .tab-content:first').show();
            $('#pressTabs li').click(function () {
                $('#pressTabs li').removeClass('active');
                $(this).addClass('active');
                $('.wrap_press-tabs .tab-content').hide();
                var activeTab = $(this).find('a').attr('href');
                $(activeTab).show();
                return false;
            });
        }, 100);
    });

    // Slider in Lightbox
    $('.card_profile .btn-link').on('click', function ($event) {
        $event.preventDefault();
        $('.dialog-model').show();
        var dialogModel = document.querySelector('.dialog-model .slick_wrap');
        var cardProfileOriginal = $event.currentTarget.closest('.slider_slick.slider_lightbox');
        var cardProfile = cardProfileOriginal.cloneNode(true);

        var currentCardProfileEle = $($event.target).parents('.card_profile')[0];
        var parentElement = currentCardProfileEle.parentElement;
        var initialSlide = 0;
        for (var index = 0; index < parentElement.children.length; index++) {
            if (parentElement.children.item(index) === currentCardProfileEle) {
                initialSlide = index;
            }
        }

        if($(cardProfileOriginal).hasClass('slick-initialized'))  {
            var skipKeys = ['appendArrows', 'appendDots', 'customPaging'];
            var options = {};
            var slickOptions = $(cardProfileOriginal).slick('getSlick').options;
            for(var optionKey of Object.keys(slickOptions)) {
                if (skipKeys.includes(optionKey)) {
                    continue;
                }

                options[optionKey] = slickOptions[optionKey];
            }

            $(cardProfileOriginal).slick('unslick');
            cardProfile = cardProfileOriginal.cloneNode(true);
            options.initialSlide = initialSlide;
            $(cardProfileOriginal).slick(options);
        }

        dialogModel.innerHTML = cardProfile.outerHTML;
        var sliderGroup = ($('.dialog-model .slider_lightbox'));
        sliderGroup.removeClass('slider_slick');
        
        sliderGroup.slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            accessibility: true,
            autoplay: false,
            autoplaySpeed: 3000,
            mobileFirst: true,
            centerMode: false,
            initialSlide: initialSlide,
            dots: false,
            arrows: false,
            responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: true,
                                    dots: true,
                                }
                            }
                        ]
        });
    });
    $('.btn_exit').on('click', function ($event) {
        $event.preventDefault();
        $('.dialog-model').hide();
    });

    // Modal Patient Care
    $('.module_patient-centered .btn-modal-left').on('click', function ($event) {
        $event.preventDefault();
        $('.modal_patient-care-left').show();
        $('body > .site-header').css('z-index', '0');
    });
    $('.modal_patient-care .btn_exit').on('click', function ($event) {
        $event.preventDefault();
        $('.modal_patient-care-left').hide();
        $('body > .site-header').css('z-index', '100');
    });

    $('.module_patient-centered .btn-modal-right').on('click', function ($event) {
        $event.preventDefault();
        $('.modal_patient-care-right').show();
        $('body > .site-header').css('z-index', '0');
    });
    $('.modal_patient-care .btn_exit').on('click', function ($event) {
        $event.preventDefault();
        $('.modal_patient-care-right').hide();
        $('body > .site-header').css('z-index', '100');
    });

    window.dispatchEvent(new UIEvent('resize'));

    // Equal Height
    /*var matchHeight = function () {
        function init() {
            eventListeners();
            matchHeight();
        }
        function eventListeners(){
            $(window).on('resize', function() {
                matchHeight();
            });
        }
        function matchHeight(){
            var groupName = $('[data-match-height]');
            var groupHeights = [];
            groupName.css('min-height', 'auto');
            groupName.each(function() {
                groupHeights.push($(this).outerHeight());
            });
            var maxHeight = Math.max.apply(null, groupHeights);
            groupName.css('min-height', maxHeight);
        };
        return {
            init: init
        };
    } ();
    matchHeight.init(); */
});


// fixed header for home page
jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 30) {
        jQuery('header.site-header').addClass('header-with-bg');
    } else {
        jQuery('header.site-header').removeClass('header-with-bg');
    }
});