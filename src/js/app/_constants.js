(function() {
    var backEndHost = "https://services.explorecredit.com";
    var mode = "prod";

    var endpoint = window.location.href;

    if (endpoint.indexOf("dev-") >= 0 || endpoint.indexOf("local") >= 0) {} else if (endpoint.indexOf("staging-") >= 0) {
        mode = "staging";
        backEndHost = "http://staging-services.explorecredit.com";
    } else {
        mode = "prod";
        backEndHost = "https://services.explorecredit.com";
    }

    window.constants = {
        APP_MODE: mode,
        APP_END_POINT: backEndHost,
        KS_MIN: 500,
        KS_MAX: 3000
    };
    window.custQuotes = [{
            name: " - Holly",
            quote: "Excellent customer service. So easy to work with always"
        },
        {
            name: " - Charles",
            quote: "Nice to work with was able to change my schedule when I needed to"
        },
        {
            name: " - Millie",
            quote: "I want to thank you all for helping me when I had a major bill due and you'll approve my loan.Thanks."
        },
        {
            name: " - Brian",
            quote: "Excellent people easy terms just as advertised would borrow again"
        },
        {
            name: " - David",
            quote: "Was helped with payment due to the Corona virus mess and I was helped in a immediately professional and kind manner .. thank you!"
        },
        {
            name: " - Michelle",
            quote: "Excellent loan with no complications or hidden fees"
        },
    ]

})();