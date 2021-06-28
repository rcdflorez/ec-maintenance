var birthDate = new Date();
var dateToday = new Date();
var dateToday2 = new Date();
var max_Date = new Date();

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
}

dateToday2 = getFormattedDate(dateToday2);

console.log(dateToday2);

dateToday.setDate(dateToday.getDate());
//console.log(dateToday);

max_Date.setDate(max_Date.getDate() + 29);

birthDate.setFullYear(birthDate.getFullYear() - 18);
var nextPayDate = new Date();
var numberOfDaysToAdd = 5;
nextPayDate.setDate(nextPayDate.getDate() + numberOfDaysToAdd);

//alert(nextPayDate );
jQuery("#date_of_birth").datepicker({
    uiLibrary: "bootstrap4",
    maxDate: birthDate,
});

jQuery("#next_pay_date").datepicker({
    uiLibrary: "bootstrap4",
    value: dateToday2,
    minDate: dateToday,
    maxDate: max_Date,
});

jQuery("#rcrCustnpdate").datepicker({
    uiLibrary: "bootstrap4",
    numberOfMonths: 1,
    minDate: nextPayDate,
});

jQuery(".btn-previous").click(previousStep);

/* PDF CALLS*/

$("#PrivacyPolicy").on("show.bs.modal", function(e) {
    PDFObject.embed("src/docs/Privacy-Policy-Explore.pdf", "#pdfTest");
});
$("#TermsofUse").on("show.bs.modal", function(e) {
    PDFObject.embed("src/docs/Terms-of-use-Explore.pdf", "#useTermsPdf");
});
$("#ElectronicDisclosure").on("show.bs.modal", function(e) {
    PDFObject.embed(
        "src/docs/Electronic-Disclosure-Explore.pdf",
        "#ElectronicDisclosurePdf"
    );
});

$("#CreditPullAuthorization").on("show.bs.modal", function(e) {
    PDFObject.embed(
        "src/docs/Authorization-Obtain-Credit-Report-Explore.pdf",
        "#CreditPullAuthorizationPdf"
    );
});

$("#exampleModalScrollable").on("show.bs.modal", function(e) {
    PDFObject.embed("src/docs/ECOA-Disclosure.pdf", "#exampleModalScrollablePdf");
});

/* PRODUCTION LOGS CALLS */
if (window.constants.APP_MODE == "prod") {
    window.addEventListener("beforeunload", function(e) {
        if (!$("#customCheck1").prop("checked") == true) {
            window.abandonedLeadErrors["final_date_time"] = getTime();
            window.abandonedLeadErrors["unic_id"] = window.abandonedLead["unic_id"];
            window.abandonedLeadErrors["ip_address"] =
                window.abandonedLead["ip_address"];

            var error_log = JSON.stringify(
                window.abandonedLeadErrors["validation_errors"]
            );

            window.abandonedLeadErrors["validation_errors"] = error_log;

            if ($("#consentCheck").prop("checked") === true) {
                $.ajax({
                    type: "POST",
                    url: "./service/abandonedLead.php",
                    data: window.abandonedLead,
                });

                $.ajax({
                    type: "POST",
                    url: "./service/abandonedLeadErrors.php",
                    data: window.abandonedLeadErrors,
                });

                if (window.abandonedLead["email"]) {
                    $.ajax({
                        type: "POST",
                        url: "http://69.61.83.183:8030/Integration/MessagingPlatformCommunication",
                        data: {
                            EmailAddress: window.abandonedLead["email"],
                            MessageType: "Email",
                            TemplateName: "NEW_CART_ABANDONMENT_1",
                        },
                    });
                }
            }

            // Cancel the event
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = "";
        }
    });
}

let autodialer_consent = "false";

$("#routing_number").blur(function() {
    var url =
        "https://www.routingnumbers.info/api/data.json?rn=" +
        $("#routing_number").val();

    $.getJSON(url, function(json) {}).done(function(json) {
        console.log(json.responseJSON);
        $("#bank_name").val(json.customer_name);
    });
});

$("#zip").blur(function() {
    var url = "https://api.zippopotam.us/us/" + $("#zip").val();

    $.getJSON(url, function(json) {}).done(function(json) {
        //$( "#bank_name" ).val(json.customer_name);
        if (json.places[0]["place name"]) {
            $("#city").val(json.places[0]["place name"]);
        }
    });
});

$("#employer_zip_code").blur(function() {
    var url = "https://api.zippopotam.us/us/" + $("#employer_zip_code").val();

    $.getJSON(url, function(json) {}).done(function(json) {
        //$( "#bank_name" ).val(json.customer_name);
        if (json.places[0]["place name"]) {
            $("#employer_city").val(json.places[0]["place name"]);
            $("#employer_state").val(json.places[0]["state abbreviation"]);
        }
    });
});

$("#customCheck2").change(function() {
    if (this.checked) {
        autodialer_consent = "true";
        window.formData["autodialer_consent"] = autodialer_consent;
    }
});
$("#dlLabel").tooltip();
$("#myModal").on("shown.bs.modal", function() {
    $("#myInput").trigger("focus");
});

function getTime() {
    var today = new Date();
    var date =
        today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
    var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (dateTime = date + " " + time);
}

function checkDevice() {
    var check = false;
    var j = "";
    (function(a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    var device = "Desktop";
    if (check === true) {
        device = "Mobile";
    }
    return [device, navigator.userAgent];
}