

let analyticsConfig = function (AnalyticsProvider) {
	AnalyticsProvider.setAccount('UA-84958569-1');
	AnalyticsProvider
    .logAllCalls(true)
    .startOffline(true);
};


analyticsConfig.$inject = ['AnalyticsProvider'];


export default analyticsConfig;