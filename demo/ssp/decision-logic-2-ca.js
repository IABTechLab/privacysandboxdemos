function log(label, o) {
  console.debug(label, JSON.stringify(o, ' ', ' '));
}

function scoreAd(
  adMetadata,
  bid,
  auctionConfig,
  trustedScoringSignals,
  browserSignals,
  directFromSellerSignals,
) {
	var score = bid+10;
  var adjustedBid = bid-3; /* simulate net adjustment */

	console.groupCollapsed( "%c PAAPI SSP2-ComponentSeller %c scoreAd %c BID:%d => SCORE:%d, SUBMITTED:%d", "color: green;  background-color:yellow; border: 1px solid black", "color: blue; border:1px solid black", "", bid, score, adjustedBid);
//		console.group('creative');
			console.log( 'owner: %s', browserSignals.interestGroupOwner );
			console.log( 'creativeURL: %s', browserSignals.renderUrl );
			console.log( 'adMetadata: %o', adMetadata );
//		console.groupEnd();

		console.log( 'sellerSignals: %o', auctionConfig.sellerSignals);
		console.log( 'trustedScoringSignals: %o', trustedScoringSignals?.renderUrl[browserSignals.renderUrl] );

//		console.groupCollapsed('browserSignals');
			console.log( 'topWindowHostname: %s', browserSignals.topWindowHostname );
			console.log( 'topLevelSeller: %s', browserSignals.topLevelSeller );
//		console.groupEnd();

	console.groupEnd();

  log('scoreAd-ca', {
    adMetadata,
    bid,
/*    auctionConfig, */
    trustedScoringSignals,
    browserSignals,
    directFromSellerSignals,
  });
 
  var debug = '&winningBid=${winningBid}&winningBidCurrency=${winningBidCurrency}&topLevelWinningBid=${topLevelWinningBid}&topLevelWinningBidCurrency=${topLevelWinningBidCurrency}';
  var bidDetails = '&owner=' + browserSignals.interestGroupOwner + '&renderURL=' + browserSignals.renderUrl + '&bid=' + bid + '&score=' + score;
  var bidMetadata = '&adomain=' + adMetadata?.adomain + '&crid=' + adMetadata.crid;
  var queryString = bidDetails + bidMetadata + debug;
  
  forDebuggingOnly.reportAdAuctionWin( auctionConfig.seller + '/ssp/forDebuggingOnly?type=reportAdAuctionWin' + queryString );
  forDebuggingOnly.reportAdAuctionLoss( auctionConfig.seller + '/ssp/forDebuggingOnly?type=reportAdAuctionLoss' + queryString );
 
  return {
    ad: { 'bid-metadata': adMetadata, 'score-metadata': {} }, /* returned to TLS */
    desirability: score,
    rejectReason: "not-available", /* https://github.com/qingxinwu/turtledove/blob/main/Proposed_First_FLEDGE_OT_Details.md#reporting */
	  bid: adjustedBid,
    allowComponentAuction: true,
  }
}

function reportResult(auctionConfig, browserSignals, directFromSellerSignals) {
	console.groupEnd();
	console.groupCollapsed( "%c PAAPI SSP2-ComponentSeller %c reportResult %c BID:%d", "color: green;  background-color:yellow; border: 1px solid black", "color: blue; border:1px solid black", "", browserSignals.bid);
		console.log( 'bid: %d', browserSignals.bid );
		console.log( 'score: %d', browserSignals.desirability );
		console.log( 'creativeURL: %s', browserSignals.renderUrl );
		console.log( 'highestOtherBid: %d', browserSignals.highestScoringOtherBid );

		console.log( 'sellerSignals: %o', auctionConfig.sellerSignals);

		console.groupCollapsed('browserSignals');
			console.log( 'topWindowHostname: %s', browserSignals.topWindowHostname );
			console.log( 'topLevelSeller: %s', browserSignals.topLevelSeller ); //only for component auctions
      console.log( 'topLevelSellerSignals: %o', browserSignals.topLevelSellerSignals ); //only for component auctions
      console.log( 'modifiedBid: %d', browserSignals.modifiedBid ); //only for component auctions
		console.groupEnd();
	console.groupEnd();
	console.groupEnd();

  log('reportResult-ca', { auctionConfig, browserSignals, directFromSellerSignals });
  sendReportTo(auctionConfig.seller + '/ssp/reporting_ca?report=result' + '&domain='+browserSignals.topWindowHostname + '&igOwner='+browserSignals.interestGroupOwner + '&winningBid='+browserSignals.bid + '&nextBid=' + browserSignals.highestScoringOtherBid + '&renderUrl='+browserSignals.renderUrl);
  return {
    success: true,
    signalsForWinner: { signalForWinner: 1 },
    reportUrl: auctionConfig.seller + '/report_seller_ca',
  };
}
