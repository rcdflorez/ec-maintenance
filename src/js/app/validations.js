// required function to start all forms validations

window.stepsNames = [
    "How Much Do You Need?",
    "Create Account",
    "General Information",
    "Income Verification",
    "Banking Information",
    "Final Authorization",
];

function initFormValidations(next) {
    // Disable default submits on each step form
    jQuery("form").submit(function(evt) {
        var formId = this.id;

        evt.preventDefault();
        var invalids = 0;
        // possible extra validations in case they are needed
        const formIdStep = formId.substring(10); // 10 = length of: "step-form-"

        if (window["validateStep" + formIdStep]) {
            const extraValidations = window["validateStep" + formIdStep]();
            if (!extraValidations) {
                return false;
            }
        }

        const inputs = jQuery("#" + formId + " :input");
        inputs.filter("[required]:visible").each(function() {
            //jQuery(this).removeClass("is-invalid");
            jQuery(this).removeClass("cypress-validation");
            if (!jQuery(this).hasClass("is-invalid")) {
                jQuery(this).closest("div").addClass("was-validated");

                if (!this.validity.valid) {
                    invalids++;
                    jQuery(this).addClass("cypress-validation");
                    // console.log("tales");
                    //jQuery(this).addClass("is-invalid");
                    if (
                        window.abandonedLeadErrors["validation_errors"][
                            window.stepsNames[window.stepsForm.getCurrentStep()]
                        ]
                    ) {
                        window.abandonedLeadErrors["validation_errors"][
                            window.stepsNames[window.stepsForm.getCurrentStep()]
                        ] += ", " + jQuery(this).attr("id");
                    } else {
                        window.abandonedLeadErrors["validation_errors"][
                            window.stepsNames[window.stepsForm.getCurrentStep()]
                        ] = jQuery(this).attr("id");
                    }
                }
            } else {
                //jQuery(this).addClass("is-invalid");
                invalids++;
                //console.log("tales 2");
                if (
                    window.abandonedLeadErrors["validation_errors"][
                        window.stepsNames[window.stepsForm.getCurrentStep()]
                    ]
                ) {
                    window.abandonedLeadErrors["validation_errors"][
                        window.stepsNames[window.stepsForm.getCurrentStep()]
                    ] += ", " + jQuery(this).attr("id");
                } else {
                    window.abandonedLeadErrors["validation_errors"][
                        window.stepsNames[window.stepsForm.getCurrentStep()]
                    ] = jQuery(this).attr("id");
                }
            }
        });

        if (invalids === 0) {
            inputs.each(function() {
                //jQuery(this).removeClass("is-invalid");
                if (this.id && this.id.length > 0) {
                    window.formData[this.id] = jQuery(this).val();
                }
            });
            if (window.stepsForm.getCurrentStep() >= 1) {
                console.log(
                    window.ga_clientID +
                    " AppStepComplete-" +
                    window.stepsNames[window.stepsForm.getCurrentStep()] +
                    " | " +
                    window.IpAddress +
                    " | " +
                    window.email +
                    " | " +
                    window.lastfour
                );
                //console.log(window.ga_clientID+" AppStepComplete-"+window.stepsNames[window.stepsForm.getCurrentStep()]+ " | " + window.IpAddress+ " | " + window.email+ " | " + window.lastfour);
                //dataLayer.push({ 'BorrowerId': "LoanId:" + LoanId + " Last4SSN:" + Last4SSN + " Email:" + Email + " BorrowerId:" + BorrowerId + " IPAdd:" + IpAddress });
                dataLayer.push({
                    BorrowerId: "AppStepComplete: " +
                        window.stepsNames[window.stepsForm.getCurrentStep()] +
                        " Last4SSN: " +
                        window.lastfour +
                        " Email: " +
                        window.email +
                        " BorrowerId: " +
                        window.ga_clientID +
                        " IPAdd: " +
                        window.IpAddress,
                });
                console.log(
                    "Step " +
                    window.stepsForm.getCurrentStep() +
                    " has been completed on: " +
                    (performance.now() - window.t1) +
                    " miliseconds."
                );
                window.StepTime[window.stepsForm.getCurrentStep()] =
                    performance.now() - window.t1;
            } else {
                console.log(
                    window.ga_clientID +
                    " AppStepComplete-" +
                    window.stepsNames[window.stepsForm.getCurrentStep()] +
                    " | " +
                    window.IpAddress
                );
            }

            next && next();
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
}

function validateStep2() {
    window.lastfour = jQuery("#ssn").val().slice(7);
    window.email = jQuery("#email").val();
    return true;
}

// After fill all fields on step 6, use data to fill Step 7 and Step 8
/*
function validateStep6() {
  // Fields from Step 4
  jQuery("#rcrCustMI").val(window.formData["stp4mincome"]);
  jQuery("#rcrCustEmp").val(window.formData["stp4employer"]);
  jQuery("#rcrCustpfrecuency").val(window.formData["stp4pfrecuency"]);
  jQuery("#rcrCustnpdate").val(window.formData["stp4npdate"]);
  
  // Fields from Step 5
  jQuery("#rcrAccNumber").val(window.formData["stp5anumber"]);
  jQuery("#rcrRoutingNumber").val(window.formData["stp5rnumber"]);
  jQuery("#rcrCustAddress").val(window.formData["stp3address"]);
  jQuery("#rcrCustcity").val(window.formData["stp3city"]);
  jQuery("#rcrCuststate").val(window.formData["stp3state"]);
  jQuery("#rcrCustzip").val(window.formData["stp3zip"]);
  
  return true;
}*/

function validateStep3() {
    // ********* Fixing format from step1
    if (typeof hdLoanRequestAmount === "undefined") {
        window.formData["loan_request_amount"] = parseInt(
            $("#loan_request_amount").val()
        );
    }

    // *********
    var yearsInMonths = 0;
    if ($("#stp3taay").val() === "") {
        $("#stp3taay").val("0");
    }
    if ($("#stp3taam").val() === "") {
        $("#stp3taam").val("0");
    }
    if ($("#stp3taam").val() > 11) {
        var x = $("#stp3taam").val();
        months = x % 12;
        years = (x - months) / 12;
        //console.log(months,years);
        $("#stp3taay").val(years);
        $("#stp3taam").val(months);
    }
    if (
        ($("#stp3taay").val() == "0" && $("#stp3taam").val() == "0") ||
        $("#stp3taay").val() + $("#stp3taam").val() ==
        0 /*|| $("#stp3taam").val() > 11*/
    ) {
        $("#stp3taay, #stp3taam").closest("div").removeClass("was-validated");
        $("#stp3taay , #stp3taam").addClass("is-invalid");
    } else {
        $("#stp3taay, #stp3taam").closest("div").addClass("was-validated");
        $("#stp3taay, #stp3taam").removeClass("is-invalid");
    }

    if ($("#stp3taay").val() > 0) {
        yearsInMonths = $("#stp3taay").val() * 12;
    }

    var finalValueInMonths = parseInt($("#stp3taam").val()) + yearsInMonths;
    window.formData["time_at_residence"] = finalValueInMonths;

    window.formData["is_military"] = $(
        "input[name=customRadioInline1]:checked",
        "#step-form-3"
    ).val();

    window.formData["tag_off_from"] = "NewAPP_PHP_JUMP";
    window.formData["ga_clientid"] = $("#hdGA_ClientID").val();

    return true;
}
$("#stp3taay,#stp3taam").change(function() {
    validateStep3();
});

function validateNextPayDate() {
    var nextPayDate = new Date();
    var numberOfDaysToAdd = 30;

    var datepickerdate = new Date($("#next_pay_date").val());

    nextPayDate.setDate(nextPayDate.getDate() + numberOfDaysToAdd);
    //alert(nextPayDate);
    if (datepickerdate <= nextPayDate) {
        $("#next_pay_date").closest("div").addClass("was-validated");
        $("#next_pay_date").removeClass("is-invalid");
    } else {
        $("#next_pay_date").closest("div").removeClass("was-validated");
        $("#next_pay_date").addClass("is-invalid");
    }
}

function validateStep4() {
    var yearsInMonths = 0;
    validateNextPayDate();

    if ($("#stp4tajy").val() === "") {
        $("#stp4tajy").val("0");
    }
    if ($("#stp4tajm").val() === "") {
        $("#stp4tajm").val("0");
    }
    if ($("#stp4tajm").val() > 11) {
        var x = $("#stp4tajm").val();
        months = x % 12;
        years = (x - months) / 12;
        $("#stp4tajy").val(years);
        $("#stp4tajm").val(months);
    }
    if (
        ($("#stp4tajy").val() == "0" && $("#stp4tajm").val() == "0") ||
        $("#stp4tajy").val() + $("#stp4tajm").val() ==
        0 /*|| $("#stp4tajm").val() > 11 */
    ) {
        $("#stp4tajy, #stp4tajm").closest("div").removeClass("was-validated");
        $("#stp4tajy , #stp4tajm").addClass("is-invalid");
    } else {
        $("#stp4tajy, #stp4tajm").closest("div").addClass("was-validated");
        $("#stp4tajy, #stp4tajm").removeClass("is-invalid");
    }

    if ($("#stp4tajy").val() > 0) {
        yearsInMonths = $("#stp4tajy").val() * 12;
    }
    var finalValueInMonths = parseInt($("#stp4tajm").val()) + yearsInMonths;
    window.formData["time_at_job"] = finalValueInMonths;

    return true;
}

$("#stp4tajy,#stp4tajm").change(function() {
    validateStep4();
});
$("#next_pay_date").change(function() {
    validateNextPayDate();
});

$("#routing_number").keyup(function() {
    if ($(this).val().length <= 5) return;

    validateRoutingNumber($(this).val());
});

function validateRoutingNumber(val) {
    var url =
        "https://www.routingnumbers.info/api/data.json?rn=" +
        $("#routing_number").val();
    if (val.length < 9) {
        $("#routing_number").addClass("is-invalid");
        $("#routing_number").removeClass("is-valid");
        return;
    }

    console.log(val.length);

    $.getJSON(url).done(function(json) {
        console.log(json);
        if (json.code == 200) {
            $("#bank_name").val(json.customer_name);

            $("#routing_number").removeClass("is-invalid");
            $("#routing_number").addClass("is-valid");
            return true;
        } else {
            $("#routing_number").addClass("is-invalid");

            return false;
        }
    });
}

function validateStep5() {
    var yearsInMonths = 0;

    if ($("#stp5hlbpy").val() === "") {
        $("#stp5hlbpy").val("0");
    }
    if ($("#stp5hlbpm").val() === "") {
        $("#stp5hlbpm").val("0");
    }
    if ($("#stp5hlbpm").val() > 11) {
        var x = $("#stp5hlbpm").val();
        months = x % 12;
        years = (x - months) / 12;
        $("#stp5hlbpy").val(years);
        $("#stp5hlbpm").val(months);
    }
    if (
        ($("#stp5hlbpy").val() == "0" && $("#stp5hlbpm").val() == "0") ||
        $("#stp5hlbpy").val() + $("#stp5hlbpm").val() ==
        0 /*|| $("#stp5hlbpm").val() > 11 */
    ) {
        $("#stp5hlbpy, #stp5hlbpm").closest("div").removeClass("was-validated");
        $("#stp5hlbpy , #stp5hlbpm").addClass("is-invalid");
    } else {
        $("#stp5hlbpy, #stp5hlbpm").closest("div").addClass("was-validated");
        $("#stp5hlbpy, #stp5hlbpm").removeClass("is-invalid");
    }

    if ($("#stp5hlbpy").val() > 0) {
        yearsInMonths = $("#stp5hlbpy").val() * 12;
    }
    var finalValueInMonths = parseInt($("#stp5hlbpm").val()) + yearsInMonths;
    window.formData["bank_account_length"] = finalValueInMonths;
    validateRoutingNumber($("#routing_number").val());
    if ($("#routing_number").hasClass("is-valid")) return true;
}
$("#stp5hlbpy,#stp5hlbpm").change(function() {
    validateStep5();
});

$("#customCheck1").change(function() {
    readyToSend = true;
    return true;
});

function sendAPIRequest() {
    window.StepTime["ga_client"] = window.ga_clientID;
    console.log(
        "Step " +
        window.stepsForm.getCurrentStep() +
        " has been completed on: " +
        (performance.now() - window.t1) +
        " miliseconds."
    );
    window.StepTime[window.stepsForm.getCurrentStep()] =
        performance.now() - window.t1;

    debugger;

    $.ajax({
        type: "POST",
        url: "./service/timeRecorder.php",
        data: window.StepTime,
    });

    //window.ga_clientID
    /*
          const params = {
            method: "POST",
            body: JSON.stringify(window.formData),
            mode: "cors"
          };
          console.log(params.body);
          fetch(window.ENDPOINT_STORE + "/api/credit", params)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return response.json();
            } else {
              response.text().then(text => {
                text && console.log(text);
              });
              throw Error(response.statusText);
            }
          })
          .then(res => {
            console.log("Response:", res);
          })
          .catch(error => {
            console.error("Request error:", error);
          });*/

    var fd = new FormData();
    Object.keys(window.formData).map((key) => {
        //console.log(key, window.formData[key]);
        fd.append(key, window.formData[key]);
    });
    jQuery.ajax({
        url: window.ENDPOINT_STORE + "/api/public/api/step1",
        type: "POST",
        data: fd,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function(response) {
            var result = JSON.stringify(response);

            if (response["Status"] === "A") {
                window.localStorage.setItem("redirectUrl", response["RedirectURL"]);
                window.location.href = "/approvedScreen.php";
            } else {
                window.localStorage.setItem("serviseResponse", result);

                window.location.href = "/deniedScreen.php";
            }
        },
    });
    return false;
}

$(document).ready(function() {
    $("#ssn").keyup(function() {
        var val = this.value.replace(/\D/g, "");

        var newVal = "";

        if (val.length > 4) {
            this.value = val;
        }
        if (val.length > 3 && val.length < 6) {
            newVal += val.substr(0, 3) + "-";

            val = val.substr(3);
        }

        if (val.length > 5) {
            newVal += val.substr(0, 3) + "-";

            newVal += val.substr(3, 2) + "-";

            val = val.substr(5);
        }

        newVal += val;
        this.value = newVal.substring(0, 11);
    });

    $("#date_of_birth, #next_pay_date, #rcrCustnpdate").keyup(function() {
        var v = this.value;

        if (v.match(/^\d{2}$/) !== null) {
            this.value = v + "/";
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            this.value = v + "/";
        }
    });

    /* $("#sliderContainer").click(function() {
            alert("Holi");
            if (document.getElementById("loan_request_amount").disabled) {
              alert("CheckBox is Disabled");
            }
          });*/

    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $("#stp1inputValue").keyup(function() {
        var updatedSliderValue = $("#stp1inputValue").val();
        updatedSliderValue = updatedSliderValue.replace(/[^0-9]/g, "");
        //updatedSliderValue = updatedSliderValue.slice(0, -2);
        updatedSliderValue = parseInt(updatedSliderValue);

        if (
            updatedSliderValue >= $("#loan_request_amount").prop("min") &&
            updatedSliderValue <= $("#loan_request_amount").prop("max")
        ) {
            jQuery(this).closest("div").addClass("was-validated");

            $("#loan_request_amount").val(updatedSliderValue);

            var val333 =
                ($("#loan_request_amount").val() -
                    $("#loan_request_amount").attr("min")) /
                ($("#loan_request_amount").attr("max") -
                    $("#loan_request_amount").attr("min"));

            $("#loan_request_amount").css(
                "background",
                "-webkit-gradient(linear, left top, right top, " +
                "color-stop(" +
                val333 +
                ", #FFD100), " +
                "color-stop(" +
                val333 +
                ", #E5E5E5)" +
                ")"
            );

            const sliderValue = document.querySelector("#moneyValue");
            const sliderRange = document.querySelector("#loan_request_amount");

            var smin = parseInt($("#loan_request_amount").prop("min"));
            var smax = parseInt($("#loan_request_amount").prop("max"));

            let offsetLeft = 10;
            const off = sliderRange.offsetWidth / (smax - smin);
            let px =
                (sliderRange.valueAsNumber - smin) * off -
                sliderValue.offsetWidth / 2 -
                offsetLeft;
            sliderValue.innerHTML = "$" + updatedSliderValue;
            $(".sliderTooltip").css("left", px);
        } else {
            jQuery(this).closest("div").removeClass("was-validated");
            jQuery(this).addClass("is-invalid");
        }
        //console.log($( "#stp1inputValue" ).val());
    });
    const slider = document.querySelector("#loan_request_amount");

    slider.addEventListener("input", updateValue);

    function updateValue(e) {
        if ($("#customer_state").val() === "SC" && $(this).val() <= 601) {
            $(this).val(601);
            $("#stp1inputValue").val("$ " + 601);
        } else if ($("#customer_state").val() != "") {
            $("#stp1inputValue").val("$ " + $("#loan_request_amount").val());
        }

        if ($("#customer_state").val() != "") {
            $("#stp1inputValue").removeClass("is-invalid");
            $("#customer_state, #stp1inputValue")
                .closest("div")
                .removeClass("was-validated");
            var val =
                ($(this).val() - $(this).attr("min")) /
                ($(this).attr("max") - $(this).attr("min"));
            $(this).css(
                "background",
                "-webkit-gradient(linear, left top, right top, " +
                "color-stop(" +
                val +
                ", #FFD100), " +
                "color-stop(" +
                val +
                ", #E5E5E5)" +
                ")"
            );
        } else {
            $("#customer_state")
                .closest("div")

            .addClass("was-validated");
            $("#customer_state").addClass("is-invalid");
        }
    }

    $("#stp1inputValue").click(function() {
        if ($(this).is("[readonly]")) {
            $("#customer_state")
                .closest("div")

            .addClass("was-validated");
            $("#customer_state").addClass("is-invalid");
        }
    });

    /*  document.getElementById('cell_phone').addEventListener('keyup', function (e){
            var x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
            if(x[1]){
              console.log(x[1]);
              e.target.value = '(' + x[1] + ') ' + x[2] + '-' + x[3];
            }
            
          });*/

    $("#SignLoanAgreement").click(function() {
        window.open(window.localStorage.getItem("redirectUrl"), "_blank");
    });

    $("#sbmtButton").click(function() {
        if ($("#customCheck1").prop("checked") == true) {
            // disable button
            $(this).prop("disabled", true);
            // add spinner to button
            $(this).html(
                `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
            );
            var result = Math.round(Math.random() * 1 + 1);
            //console.log(result);
            sendAPIRequest();
            /*
                              if (result === 1) {
                                setTimeout(function() {
                                  window.location.href = "/leapcreditaplication/approvedScreen.php";
                                }, 2000);
                              } else {
                                setTimeout(function() {
                                  window.location.href = "/leapcreditaplication/deniedScreen.php";
                                }, 2000);
                              }*/
        }
    });
});

// EOF