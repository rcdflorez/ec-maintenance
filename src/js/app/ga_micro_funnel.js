$(":input").focus(function() {

    var identifier = $(this).attr('id');

    if (identifier == undefined) {
        identifier = $(this).data('cy');
    }

    var path = window.location.pathname.substring(1);

    if (!path) {
        path = "EntryPage"
    }

    var stepIdentifier = $(this).closest("form").attr('id');

    var ulrValue = stepIdentifier + "/" + path + "#" + identifier;

    //console.log(ulrValue);
    ga("set", "page", ulrValue);
    ga("send", "pageview");
});