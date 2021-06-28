function autoFillStep1() {
    //$("#stp1whatdoyouneeditfor").val(faker.fake("{{lorem.words}}"));
}

function autoFillStep2() {
    $("#email").val(faker.fake("test.renee.hiverson" + moment().unix() + "@gmail.com"));
    $("#ssn").val(faker.helpers.replaceSymbolWithNumber("###-##-####"));
    var dobDay = moment()
        .add(-faker.random.number(30), "years")
        .add(faker.random.number(30), "days");
    $("#date_of_birth").val(dobDay.subtract(18, 'years').format("MM/DD/YYYY"));
}

function autoFillStep3() {
    $("#first_name").val(faker.fake("{{name.firstName}}"));
    $("#last_name").val(faker.fake("{{name.lastName}}"));
    $("#cell_phone").val(
        faker.random.number({ min: 1000000000, max: 10000000000 })
    );
    $("#address").val(faker.address.streetAddress(false));

    $("#city").val(faker.address.city);
    //$("#state").val(faker.address.stateAbbr);
    $("#zip").val(faker.address.zipCode("#####"));

    $("#stp3taay").val(faker.random.number({ min: 1, max: 10 }));
    $("#stp3taam").val(faker.random.number({ min: 0, max: 12 }));

    $("#drivers_license_number").val(
        faker.helpers.replaceSymbolWithNumber("#######")
    );
    $("#driver_license_state").val(faker.address.stateAbbr);

    $("#customRadioInline1").prop("checked", true).trigger("click");
}

function autoFillStep4() {
    $("#monthly_income").val(faker.random.number({ min: 1000, max: 10000 }));
    $("#next_pay_date").val(
        moment().add(faker.random.number(30), "days").format("MM/DD/YYYY")
    );

    $("#employer_name").val(faker.fake("{{name.findName}}"));
    $("#stp4cphone").val(
        faker.random.number({ min: 1000000000, max: 10000000000 })
    );
    $("#employer_address").val(faker.address.streetAddress(false));
    $("#stp4jtitle").val(faker.name.title);
    $("#stp4tajy").val(faker.random.number({ min: 1, max: 10 }));
    $("#stp4tajm").val(faker.random.number({ min: 0, max: 12 }));
}

function autoFillStep5() {
    $("#bank_account_number").val(faker.fake("{{finance.account}}"));
    $("#routing_number").val(
        faker.fake("{{finance.account}}") +
        "" +
        faker.random.number({ min: 1, max: 9 })
    );
    $("#stp5hlbpy").val(faker.random.number({ min: 1, max: 10 }));
    $("#stp5hlbpm").val(faker.random.number({ min: 0, max: 12 }));
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function autoPopulate() {
    autoFillStep1();
    autoFillStep2();
    autoFillStep3();
    autoFillStep4();
    autoFillStep5();
}