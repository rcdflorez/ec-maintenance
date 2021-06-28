function initRangeSlider(custSt, maxValue) {
    if (custSt === "" && maxValue != "") {
        $("#loan_request_amount").prop("max", maxValue);
        $("#loan_request_amount").prop("min", 300);
    }

    var hdLoanRequestAmount = "";
    const sliderRange = document.querySelector("#loan_request_amount");
    const sliderValue = document.querySelector("#moneyValue");
    const inputFieldValue = document.querySelector("#stp1inputValue");

    sliderValue.parentElement.classList.remove("d-none");

    document.querySelector("#slider-minvalue").innerHTML = "$" + sliderRange.min;
    document.querySelector("#slider-maxvalue").innerHTML = "$" + sliderRange.max;

    var smin = parseInt($("#loan_request_amount").prop("min"));
    if (window.constants[custSt + "_API"]) {
        $("#loan_request_amount").prop("min", window.constants[custSt + "_API"]);
        smin = parseInt($("#loan_request_amount").prop("min"));
    }
    var smax = parseInt($("#loan_request_amount").prop("max"));
    //var midValue = (smin + smax) / 2; Original calculation of mid value
    var midValue = smin + 200; // New calculation of min loan amount + $200
    midValue = Math.ceil(midValue / 5) * 5;
    let params = new URL(location).searchParams;
    if (!params.get("amount")) {
        $("#loan_request_amount").val(midValue);
    } else {
        hdLoanRequestAmount = params.get("amount");
        hdLoanRequestAmount = hdLoanRequestAmount.replace(/[^0-9]/g, "");
        hdLoanRequestAmount = hdLoanRequestAmount.slice(0, -2);
        hdLoanRequestAmount = parseInt(hdLoanRequestAmount);
        $("#loan_request_amount").val(hdLoanRequestAmount);
        midValue = hdLoanRequestAmount;
    }
    if (custSt === "" && maxValue != "") {
        midValue = maxValue;
        $("#loan_request_amount").val(maxValue);
    }
    inputFieldValue.value = "$ " + midValue;
    //$("#stp1inputValue").val("$"+$("#loan_request_amount").val());

    let offsetLeft = 30;
    if (window.INITSLIDERVALUE != 0) {
        offsetLeft = 0;
    }
    let off = sliderRange.offsetWidth / (smax - smin);

    const px =
        (sliderRange.valueAsNumber - smin) * off -
        sliderValue.offsetParent.offsetWidth / 2 -
        offsetLeft;

    //alert(window.INITSLIDERVALUE); alert (offsetLeft);

    window.INITSLIDERVALUE = window.INITSLIDERVALUE + 1;

    sliderValue.parentElement.style.left = px + "px";
    sliderValue.parentElement.style.top = -(sliderRange.offsetHeight + 20) + "px";

    if (custSt === "" && maxValue != "") {}

    //var val333 = ($( "#loan_request_amount" ).val() - $( "#loan_request_amount" ).attr('min')) / ($( "#loan_request_amount" ).attr('max') - $( "#loan_request_amount" ).attr('min'));
    var holi =
        ($("#loan_request_amount").val() - $("#loan_request_amount").attr("min")) /
        ($("#loan_request_amount").attr("max") -
            $("#loan_request_amount").attr("min"));

    sliderValue.innerHTML = "$" + midValue;
    $("#loan_request_amount").css(
        "background",
        "-webkit-gradient(linear, left top, right top, " +
        "color-stop(" +
        holi +
        ", #FFD100), " +
        "color-stop(" +
        holi +
        ", #E5E5E5)" +
        ")"
    );

    sliderRange.oninput = function() {
        offsetLeft = 3; // this line fix parent box padding in css.
        let px =
            (sliderRange.valueAsNumber - smin) * off -
            sliderValue.offsetWidth / 2 -
            offsetLeft;
        sliderValue.innerHTML = "$" + sliderRange.value;
        if (
            $("#customer_state").val() === "SC" &&
            $("#loan_request_amount").val() <= 601
        ) {
            sliderValue.innerHTML = "$" + 601;
        }

        sliderValue.parentElement.style.left = px + "px";
        //console.log(px);
        //$("#stp1inputValue").val($("#moneyValue").val());

        //var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    };
}