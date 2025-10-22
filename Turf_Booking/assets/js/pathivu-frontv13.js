var pathivu_loader = '<div class="pathivu-loader"><div class="spinner-border m-5" role="status"><span class="visually-hidden">Loading...</span></div></div>';
var laction = 'checkmobile';
$("#mobilecheck").click(function(e) {
    e.preventDefault();
    const phone = $('#pathivu_user_phone').val();
    const custResp = $('#pathivu_mobilehash').val();
    const phoneRegex = /^[6789][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        $("#notifyAlert").text("Incorrect Phone Number").css({
            color: '#dc3545'
        });
        return;

    }

    $.post(generalObj.ajax_url + "pathivu_check_mobile_ajax.php", {
        phone: phone,
        action: laction,
        hash: custResp
    }, function(response) {
        if (response.type === "success") {
            if (laction == 'hashcheck') {
                $('#pathivu_user_phone').prop('readonly', true);
                $('#pathivu_mobileotp').hide();
                $("label[for='pathivu_user_phone']").css({
                    color: '#30ba8f'
                });
                if (response.prev)
                    $("#mobilecheck").hide();
                $("#pathivu_stat").val("verified");
                $('#pathivu_userinfo').show();
                $('#pathivu_user_reg').show();
                $("#pathivu_user_firstname").focus();
            } else {
                $('#pathivu_mobileotp').show();
                $("#mobilecheck").html('Submit');
                laction = 'hashcheck';
                $('#pathivu_user_phone').prop('readonly', true);
            }

            $("#notifyAlert").text(response.message).css({
                color: '#30ba8f'
            });
        } else {
            $("#notifyAlert").text(response.message).css({
                color: '#dc3545'
            });
            $("#pathivu_user_phone").focus();

            if (response.prev)
                $("#mobilecheck").hide();

            if (response.type == "exist")
                $("#pathivu_stat").val(response.type);
        }
    }, 'json').fail(function() {
        $("#notifyAlert").text('Failed in Mobile Validation, Please try later').css({
            color: '#dc3545'
        });

    });
});

$(document).ready(function() {
    var ajaxurl = generalObj.ajax_url;
    var site_url = generalObj.site_url;

    /** Validation patterns **/
    var is_phone_min = 10;
    var is_phone_max = 10;

    $('#pathivu-front-register-modal').on('hidden.bs.modal', function() {
        $(this).find('form').trigger('reset');
        $("#mobilecheck").show();
        $("#notifyAlert").text('');
        $('#pathivu_mobileotp').hide();
        $("#mobilecheck").html('Validate');
        $('#pathivu_userinfo').hide();
        $('#pathivu_user_phone').prop('readonly', false);
        laction = 'checkmobile';
    });

    $('#pathivu_user_email').on('blur', function() {
        const mail = $(this).val();
        const mailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!mailRegex.test(mail)) {
            alert('Please enter a Valid Email.');


        }
    });
    $('#pathivu_user_zip').on('blur', function() {
        const pin = $(this).val();
        const pinRegex = /^[6][0-9]{5}$/;
        if (!pinRegex.test(pin)) {
            alert('Please enter a Valid PIN Code.');

        }
    });

    $("#pathivu_customer_register_form").validate({
        rules: {
            pathivu_user_firstname: {
                required: true,
                maxlength: 50
            },
            pathivu_user_email: {
                required: true,
                email: true,
                remote: {
                    url: ajaxurl + "pathivu_check_email_ajax.php",
                    type: "POST",
                    async: false,
                    data: {
                        email: function() {
                            return $("#pathivu_user_email").val();
                        },
                        check_email_exist: 1
                    }
                }
            },
            pathivu_user_phone: {
                required: true,
                minlength: is_phone_min,
                maxlength: is_phone_max
            },
            pathivu_user_city: {
                required: true
            },
            pathivu_user_zip: {
                required: true,
                minlength: 5,
                maxlength: 10
            },
            pathivu_user_dob: {
                required: true
            },
            pathivu_consent: {
                required: true
            },
        },
        messages: {
            pathivu_user_email: {
                required: langObj.please_enter_email,
                email: langObj.please_enter_valid_email,
                remote: langObj.email_already_exist
            },

            pathivu_user_firstname: {
                required: langObj.please_enter_first_name,
                maxlength: langObj.please_enter_maximum_50_characters
            },
            pathivu_user_lastname: {
                required: langObj.please_enter_last_name,
                maxlength: langObj.please_enter_maximum_50_characters
            },
            pathivu_user_phone: {
                required: langObj.please_enter_phone_number,
                minlength: langObj.please_enter_10_digits,
                maxlength: langObj.please_enter_10_digits
            },
            pathivu_user_address: {
                required: langObj.please_enter_address
            },
            pathivu_user_city: {
                required: langObj.please_enter_city
            },
            pathivu_user_zip: {
                required: langObj.please_enter_zip,
                minlength: langObj.please_enter_minimum_5_characters,
                maxlength: langObj.please_enter_maximum_10_characters
            },
            pathivu_user_dob: {
                required: langObj.please_enter_birthdate
            },
            pathivu_consent: {
                required: "Please read and agree to the Terms!!"
            },
        },
        submitHandler: function(form) {
            var pathivu_c_ans = generalObj.pathivu_c_ans;
            var captcha_val = $('#pathivu_login_captcha').val();

            if (pathivu_c_ans != 'disabled') {
                if (captcha_val != pathivu_c_ans) {
                    $('#pathivu-captcha-error').show();
                    return false;
                }
            }

            var firstname = $("#pathivu_user_firstname").val();
            var lastname = $("#pathivu_user_lastname").val();
            var email = $("#pathivu_user_email").val();
            var phone = $("#pathivu_user_phone").val();
            var address = $("#pathivu_user_address").val();
            var city = $("#pathivu_user_city").val();
            var zip = $("#pathivu_user_zip").val();
            var dob = $("#pathivu_user_dob").val();
            var agreed = $("#pathivu_consent").is(":checked");
            var stat = $("#pathivu_stat").val();

            if (stat == "exist") {
                $("#notifyAlert").text('Profile Already Exist, Thanks for Interest!').css({
                    color: '#dc3545'
                });
            } else if (stat == "verified") {
                $.ajax({
                    type: 'post',
                    data: {
                        'email': email,
                        'firstname': firstname,
                        'lastname': lastname,
                        'phone': phone,
                        'address': address,
                        'city': city,
                        'zip': zip,
                        'dob': dob,
                        'customer_register': 1
                    },
                    url: ajaxurl + "pathivu_cust_onboard.php",
                    success: function(res) {
                        $(".pathivu-loader").remove();
                        if (res == "registered") {
                            swal(langObj.registered, langObj.you_are_registered_successfully_please_login, "success");
                            window.location.replace(site_url);
                        } else {
                            swal(langObj.opps, langObj.something_went_wrong_please_try_again + " " + response, "error");
                        }
                    }
                });
            } else {
                $("#notifyAlert").text('Verify your Mobile before Submitting!').css({
                    color: '#dc3545'
                });
            }
        }
    });
});

/** Prevent enter key stroke on form inputs **/
$(document).on("keydown", '.pathivu form input', function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        return false;
    }
});