function previousStep() {
    window.stepsForm.prevStep();
}

function nextStep() {
    const step = window.stepsForm.getCurrentStep();
    window.t1 = performance.now();

    $("div.name").html(window.custQuotes[step].name);
    $("div.cust_quote").html('"' + window.custQuotes[step].quote + '"');

    step1Result = 4.5;

    // window.stepsTimer[window.stepsForm.getCurrentStep() + 1] = 4.5

    if (step >= 1) {
        console.log(
            window.ga_clientID +
            " AppStepLoad-" +
            window.stepsNames[window.stepsForm.getCurrentStep() + 1] +
            " | " +
            window.IpAddress +
            " | " +
            window.email +
            " | " +
            window.lastfour
        );
        window.abandonedLead["unic_id"] = window.ga_clientID;
        window.abandonedLead["ip_address"] = window.IpAddress;
        window.abandonedLead["email"] = window.email;
        window.abandonedLead["last_four"] = window.lastfour;
        window.abandonedLead["cell_phone"] = $("#cell_phone").val();
    } else {
        console.log(
            "Step " +
            window.stepsForm.getCurrentStep() +
            " has been completed on: " +
            (window.t1 - window.t0) +
            " miliseconds."
        );
        window.StepTime[window.stepsForm.getCurrentStep()] = window.t1 - window.t0;
        console.log(
            window.ga_clientID +
            " AppStepLoad-" +
            window.stepsNames[window.stepsForm.getCurrentStep() + 1] +
            " | " +
            window.IpAddress
        );
        window.abandonedLead["unic_id"] = window.ga_clientID;
        window.abandonedLead["ip_address"] = window.IpAddress;
    }

    if (step < MAX_STEPS) {
        window.stepsForm.nextStep();
    }
}

// Every time the stepper change the current step, we will need to update the UI here:
window.stepsProgress = [16, 32, 50, 66, 82, 100];

function handleStepChange(step) {
    console.log(step);
    // TODO: Remove this temporal validation.. it's used only to void blank steps:
    if (step < MAX_STEPS) {
        jQuery(".step").hide();
        jQuery(".step-" + (step + 1)).show();
        $("div.side-bar-menu .navbar-nav li").removeClass("active");

        //$("div.side-bar-menu .navbar-nav li").prepend( "<p>Test</p>" );

        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo#Example
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        // console.log("set progress bar to step:", step);

        const stepValue = window.stepsProgress[step];
        $(".progress-bar").css({
            width: stepValue + "%",
        });
        $(".progress-bar").attr("aria-valuenow", stepValue);
        $("div.side-bar-menu .navbar-nav li.nb-stp-" + (step - 1)).addClass(
            "completed"
        );
        $("div.side-bar-menu .navbar-nav li.nb-stp-" + step).addClass("active");

        const stateData = window.statesRules[step];
        if (stateData) {
            history.pushState({},
                stateData.title,
                stateData.url + window.location.search
            );
            ga("set", "page", window.location.pathname.substring(1) + "*");
            ga("send", "pageview");
            //console.log('GA updated');
        }
    }
}

function initApp() {
    window.StepTime = {};
    window.t0 = performance.now();

    $("#autoplink").click(function() {
        autoPopulate();
    });

    let ref_data = document.referrer;
    if (ref_data != "") {
        window.formData["reference_id"] =
            "source=" + ref_data + "&GAID=" + window.ga_clientID;
    } else {
        window.formData["reference_id"] =
            "source=directTraffic&GAID=" + window.ga_clientID;
    }

    //var hdLoanRequestAmount = "";
    var hdPurposeForLoan = "";
    var hdCampaign = "";
    var hdAtnid = "";

    let params = new URL(location).searchParams;

    window.abandonedLead = {};
    window.abandonedLeadErrors = {};
    window.abandonedLeadErrors["device_info"] = checkDevice().toString();
    window.abandonedLeadErrors["validation_errors"] = {};

    window.abandonedLeadErrors["initial_date_time"] = getTime();

    // on validations file:
    initFormValidations(nextStep);

    // Everything start here!
    window.stepsForm = new Stepper();
    window.stepsForm.addListener(handleStepChange);

    // TODO: remove the following call or use it for testing to choose the initial step:
    //handleStepChange(3);
    ref_data = "mailoffer";
    const pinValue = params.get("pin");
    if (pinValue != null) {
        let breaker = false;
        console.log(pinValue);
        fetch("https://search-service.explore-test.workers.dev/?pin=" + pinValue)
            .then((response) => response.json())
            .then((jsondata) => {
                if (jsondata.LINE_AMOUNT) {
                    const approvedAmount = parseInt(
                        jsondata.LINE_AMOUNT.replace(/,/g, "")
                    );
                    initRangeSlider("", approvedAmount);
                } else {
                    breaker = true;
                }
            });

        $("#customer_state").change(function() {
            if ($(this).hasClass("is-invalid")) {
                /*$("#customer_state")
                                                                                                                                                                                                                                                                .closest("div")
                                                                                                                                                                                                                                                                .addClass("was-validated");*/
                $(this).removeClass("is-invalid");
            }
            if ($("#stp1inputValue").hasClass("simuleDisabled")) {
                //$("#loan_request_amount").addClass("filled");
                $("#stp1inputValue").css("background-color", "white");
                $("#loan_request_amount, #stp1inputValue").prop("readonly", false);
            }
            $("#loan_request_amount").prop("disabled", false);
            console.log(breaker);
            if (breaker) initRangeSlider($("this").val());
        });
        return;
    }

    if (params.get("st")) {
        //alert(params.get("st"));
        //$("#customer_state").value(params.get("st"));

        //$("#stContainer").addClass("d-none");
        var custSt = params.get("st").toUpperCase();
        $("#loan_request_amount").prop("min", window.constants[custSt + "_MIN"]);
        $("#loan_request_amount").prop("max", window.constants[custSt + "_MAX"]);
        $("#sliderContainer").removeClass("d-none");
        $("#stp1inputValue").css("background-color", "white");
        initRangeSlider(custSt);

        $("#customer_state").val(custSt);
        $("#state").val($("#customer_state").val());
        $("#state").attr("disabled", true);
    } else {
        $("#loan_request_amount, #stp1inputValue").prop("readonly", true);
    }
    $("#stp1inputValue").focusout(function() {
        var amountValue = $(this).val();
        var minValue = parseInt($("#loan_request_amount").prop("min"), 10);
        var maxVale = parseInt($("#loan_request_amount").prop("max"), 10);

        if (amountValue.charAt(0) == "$") {
            amountValue = amountValue.substring(2);
        }

        amountValue = parseInt(amountValue, 10);

        if (amountValue >= minValue && amountValue <= maxVale) {
            if (
                $("#stp1inputValue").val().charAt(0) != "$" &&
                $("#stp1inputValue").val().charAt(0) != ""
            ) {
                $(this).val("$ " + amountValue);
            }
            $(this).removeClass("is-invalid");
        }
    });
    $("#customer_state").change(function() {
        $("#state").val($("#customer_state").val());
        $("#state").attr("disabled", true);

        if ($(this).hasClass("is-invalid")) {
            /*$("#customer_state")
                                                                                                                                                                                                                              .closest("div")
                                                                                                                                                                                                                              .addClass("was-validated");*/
            $(this).removeClass("is-invalid");
        }
        if ($("#stp1inputValue").hasClass("simuleDisabled")) {
            //$("#loan_request_amount").addClass("filled");
            $("#stp1inputValue").css("background-color", "white");
            $("#loan_request_amount, #stp1inputValue").prop("readonly", false);
        }
        $("#loan_request_amount").prop("disabled", false);
        custSt = $("#customer_state").val();
        //$("#customer_state").prop("disabled", true);
        //$("#loadingGif").addClass("d-none");

        $("#loan_request_amount").prop("min", window.constants[custSt + "_MIN"]);

        $("#loan_request_amount").prop("max", window.constants[custSt + "_MAX"]);

        initRangeSlider(custSt);
        if ($("#customer_state").val() === "") {
            $("#loan_request_amount").prop("disabled", true);
        }
    });
    //alert("1");

    if (params.get("amount")) {
        hdLoanRequestAmount = params.get("amount");
        hdLoanRequestAmount = hdLoanRequestAmount.replace(/[^0-9]/g, "");
        hdLoanRequestAmount = hdLoanRequestAmount.slice(0, -2);
        hdLoanRequestAmount = parseInt(hdLoanRequestAmount);
        //$("#loan_request_amount").val(hdLoanRequestAmount);
        //alert("2");

        //moneyValue.value = hdLoanRequestAmount;
        //console.log(hdLoanRequestAmount);
    }
    if (params.get("why")) {
        hdPurposeForLoan = params.get("why");
        $("#purpose_for_loan").val(hdPurposeForLoan);
        window.formData["PurposeForLoan"] = hdPurposeForLoan;
    }
    if (params.get("campaign")) {
        hdCampaign = params.get("campaign");
        window.formData["campaign"] = hdCampaign;
    }
    if (params.get("utm_source") && params.get("utm_medium")) {
        window.formData["reference_id"] =
            "source=" +
            params.get("utm_source") +
            "|medium=" +
            params.get("utm_medium");
    }
    if (params.get("atnid")) {
        hdAtnid = params.get("atnid");
        window.formData["reference_id"] = hdAtnid;
    }

    if (params.get("amount") && params.get("why") && params.get("st")) {
        if (hdLoanRequestAmount > 0) {
            window.formData["loan_request_amount"] = hdLoanRequestAmount;
            window.formData["purpose_for_loan"] = params.get("why");

            //console.log($("#loan_request_amount").val());
            nextStep();
        }
    }

    console.log(
        window.ga_clientID +
        " AppStepLoad-" +
        window.stepsNames[window.stepsForm.getCurrentStep()] +
        " | " +
        window.IpAddress
    );
}
window.addEventListener("DOMContentLoaded", initApp);
window.INITSLIDERVALUE = 0;
window.MAX_STEPS = 6;
window.formData = {};
window.ENDPOINT_STORE = window.constants.APP_END_POINT;
window.statesRules = [{
        title: "Start Application",
        url: "/StartApplication",
    },
    {
        title: "Getting Started",
        url: "/GettingStarted",
    },
    {
        title: "General Information",
        url: "/GeneralInformation",
    },
    {
        title: "Income Verification",
        url: "/IncomeVerification",
    },
    {
        title: "Banking Information",
        url: "/BankingInformation",
    },
    {
        title: "Final Authorization",
        url: "/FinalAuthorization",
    },
];