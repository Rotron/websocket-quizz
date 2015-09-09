require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, ps) {

    var domBody,
        listenerId;

    io.setPort(8000);
    io.setServerUrl(document.location.hostname);
    ps.setNetworkAdapter(io);

    domReady(function () {
        var domButtons;

        dm.run();

        domBody = dm.query('body');

        domStartButton = dm.query('.start');

        domButtons = dm.queryAll('.answer');
        domButtons.forEach(function (btn) {
            btn.on('click', onClickButton);
        });

        domBody.addClass('wait');

        ps.subscribe(io.EVENT_READY, function () {
            console.log('connected to server');

            domStartButton.on('click', function () {
                pubsub.publish(constants.MESSAGE.GAME_START, {});
            });
            domStartButton.toggleClass('hidden');

            listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        });

        console.log('init');
    });

    function onClickButton(event) {
        var payload = { response: dm.query(this).data('r') };        
        pubsub.publish('ANSWER_SENT', payload);
        domBody.removeClass('game-layout');
        domStartButton.addClass('hidden');
        domBody.addClass('wait');
    }

    function displayGameLayout(param) {
        pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        domBody.removeClass('wait');
        domBody.addClass('game-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.TIMER_END, endTimer);
    }

    function endTimer() {
        pubsub.unsubscribe(constants.MESSAGE.TIMER_END, listenerId);
        domBody.removeClass('game-layout');
        domBody.removeClass('wait');

        domBody.addClass('end-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.RESULT_SENT, displayResult);
    }

    function displayResult (result) {
        pubsub.unsubscribe(constants.MESSAGE.RESULT_SENT, listenerId);

        domBody.removeClass('end-layout');
        domBody.addClass('result-layout');
    }

    window.pubsub = ps;

});