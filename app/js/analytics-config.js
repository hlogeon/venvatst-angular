

let analyticsConfig = function (AnalyticsProvider) {
	AnalyticsProvider
	.setAccount('UA-84958569-1')
	.useAnalytics(false)
    .logAllCalls(true)
    .trackPages(true)
    .ignoreFirstPageLoad(true)
    .setPageEvent('$stateChangeSuccess')
    .setRemoveRegExp(/\/\d+?$/)
    .startOffline(false);
};


analyticsConfig.$inject = ['AnalyticsProvider'];


export default analyticsConfig;