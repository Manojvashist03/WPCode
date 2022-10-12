jQuery(document).ready(function ($) {
    // events
        const filter1 = $("#filter1").val();
        const filter2 = $("#filter2").val();
    
        let windowSize = $(window).width();
        if (windowSize > 1024) {
            $(".hidden_desktop").hide();
            $(filter1 + ',' + filter2).change(function () {
                let catVal = $(filter1).val();
    
                let tagVal = $(filter2).val();
                call_resource_article_ajax(catVal, tagVal);
                document.location.hash = `resourcePage=1&cat=${catVal}&tag=${tagVal}`;
            })
        } else {
            $(".hidden_desktop").show();
            $("#submit-button").click(function () {
                let catVal = $(filter1).val();
                let tagVal = $(filter2).val();
                call_resource_article_ajax(catVal, tagVal);
                document.location.hash = `resourcePage=1&cat=${catVal}&tag=${tagVal}`;
            })
        }
    
        // For admin to load ajax.
        setTimeout(function () {
            if ($(".wp-block-genesis-custom-blocks-sbx-genesis-resource-articles").length) {
                call_resource_article_ajax();
            }
        }, 2000);
        $(document).on('change', '.gcb-editor-form select,input,textarea,button', function (e) {
            setTimeout(function () {
                if ($(".wp-block-genesis-custom-blocks-sbx-genesis-resource-articles").length) {
                    call_resource_article_ajax();
                }
            }, 2000);
        });
        // admin load ajax end.
    
        $("#clear-filter").click(function () {
            document.location.hash = '';
            $(filter1).val('');
            $(filter2).val('');
            location.reload();
            //   call_resource_article_ajax();
        })
    
        // if resourcePage id found in page
        if ($("#resourcePage").length === 1) {
            call_resource_article_ajax();
            paginationCick();
        }
    
    
    // functions
        var temp = 0;
    
        function call_resource_article_ajax(cat = hashParam('cat'), tag = hashParam('tag'), page = hashParam('resourcePage'), posts_per_page = paginationList()) {
    
            const action = 'resource_articles';
            const ajaxUrl = admin.ajaxurl;
            const nonce = $("#nonce").val();
            const postType = $("#postType").val();
            const postCat = $("#postCat").val();
            const orderBy = $("#orderBy").val();
            const filter = $("#filter").val();
            const filterBy = cat + ',' + tag;
            const data = {
                nonce: nonce,
                action: action,
                page: page,
                posts_per_page: posts_per_page,
                postType: postType,
                postCat: postCat,
                orderBy: orderBy,
                filter: filter,
                filterBy: filterBy
            };
            $.ajax({
                url: ajaxUrl,
                contentType: "text/html; charset=utf-8",
                data: data,
                method: 'GET',
                success: function (result, err) {
                    $("#resourcePage").html('');
                    if (result) {
                        $("#resourcePage").append(result);
                        paginationCick();
                        if (hashParam('cat') != 'undefined') {
                            $(filter1).val(hashParam('cat'));
                        }
                        if (hashParam('tag') != 'undefined') {
                            $(filter2).val(hashParam('tag'));
                        }
                        console.log(hashParam('cat'), hashParam('tag'))
    
                        if (temp != 0) {
                            $('html, body').animate({
                                scrollTop: $('.module_resource-article').offset().top - 50//#DIV_ID is an example. Use the id of your destination on the page
                            }, 'slow');
                        }
                    }
                }
            })
            // alert(temp)
            // if(temp!=0) {
            //     if (!hashParam('cat') && !hashParam('tag') && !hashParam('resourcePage')) {
            //         document.location.hash = 'resourcePage=1';
            //     }
            // }
            temp++;
        }
    
    
        function paginationCick() {
            $(".pagination").click(function () {
                let page = $(this).attr("page-id");
                let catVal = ($(filter1).val() == 'undefined' ||$(filter1).val() == '') ? '': $(filter1).val();
                let tagVal = ($(filter2).val() == 'undefined' ||$(filter2).val() == '') ? '': $(filter2).val();
                call_resource_article_ajax(catVal, tagVal, page);
                document.location.hash = `resourcePage=${page}&cat=${catVal}&tag=${tagVal}`;
            })
        }
    
        function hashParam(param) {
            let url = $(location).prop('hash').substr(1);
            let diffUrl = url.split("&");
            let flag = 0;
            for (let i = 0; i < diffUrl.length; i++) {
                let x = diffUrl[i].split('=');
                let HashParam = x[0].trim();
                if (HashParam == param) {
                    flag = x[1].trim();
                    break;
                } else {
                    flag = 0;
                }
            }
            return (flag) ? flag : '';
        }
    
        function paginationList() {
            let windowSize = $(window).width();
            const desktopView = $('#desktopView').val();
    
            const tabView = $("#tabView").val();
            const mobileView = $("#mobileView").val();
            let returnPages = 12;
    
            if (windowSize <= 767) {
                returnPages = (mobileView) ? mobileView : 5;
            } else if (windowSize <= 1023) {
                returnPages = (tabView) ? tabView : 6;
    
            } else {
                returnPages = (desktopView) ? desktopView : 12;
            }
    
            return returnPages;
        }
    });