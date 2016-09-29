

let analyticsConfig = function (AnalyticsProvider) {
	AnalyticsProvider.setAccount('UA-84958569-1');
	AnalyticsProvider
    .logAllCalls(true)
    .startOffline(true);

    AnalyticsProvider.trackPages(true); //track all the routes
    AnalyticsProvider.trackUrlParams(false); //don't track all url params
    AnalyticsProvider.ignoreFirstPageLoad(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess'); // UI-Router raises $stateChangeSuccess on page change
};


analyticsConfig.$inject = ['AnalyticsProvider'];


export default analyticsConfig;