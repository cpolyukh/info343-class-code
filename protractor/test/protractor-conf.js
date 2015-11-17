exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*-spec.js'],
    rootElement: 'body' //optional but helps locate the ng-app based on the selector the ng-app is attached to
};
