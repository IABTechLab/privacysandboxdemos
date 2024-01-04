const auctionConfig = {
  seller: topLevelSeller,

  decisionLogicUrl: `${topLevelSeller}/ssp/decision-logic-tls.js`,
  trustedScoringSignalsUrl: `${topLevelSeller}/ssp/kv.json`, 

  auctionSignals: { auction_signals: 'top_auction_signals' },
  sellerSignals: { seller_signals: 'top_seller_signals' },
  perBuyerSignals: {
    [`${buyer1}`]: { per_buyer_signals: 'top_per_buyer_signals' },
  },
  componentAuctions: [
	  {
		  seller: componentSeller1,

		  decisionLogicUrl: `${componentSeller1}/ssp/decision-logic-ca.js`,
		  trustedScoringSignalsUrl: `${componentSeller1}/ssp/kv.json`, 

		  auctionSignals: { auction_signals: 'ca_auction_signals-1' },
		  sellerSignals: { floor: 17, auctionID: 'ca_seller_signals_1-' + Math.round(Math.random() * 1000000 ) },
		  interestGroupBuyers: [
		    buyer1,
		  ],
		  perBuyerSignals: {
		    [`${buyer1}`]: { buyerdata: 'top_per_buyer_signals_ca1' },
		  },
	  },
	  {
		  seller: componentSeller2,

		  decisionLogicUrl: `${componentSeller2}/ssp/decision-logic-2-ca.js`,
		  trustedScoringSignalsUrl: `${componentSeller2}/ssp/kv.json`, 

		  auctionSignals: { auction_signals: 'ca_auction_signals_2' },
		  sellerSignals: { floor: 71, auctionID: 'ca_seller_signals_2-' + Math.round(Math.random() * 1000000 ) },
		  interestGroupBuyers: [
		    buyer1,
		    buyer2,
		  ],
		  perBuyerSignals: {
		    [`${buyer1}`]: { buyerdata: 'top_per_buyer_signals_ca2' },
		    [`${buyer2}`]: { buyerdata: 'top_per_buyer_signals_ca2' },
		  },
	  },
  ]
};

var adAuctionID = 'fledge-iframe';

var b = document.createElement('button');
b.innerHTML = 'runAdAuction';
b.style = 'display: block';
b.onclick = async() => {
  var old = document.getElementById(adAuctionID);
  old?.remove() ;

  const adAuctionResult = await navigator.runAdAuction(auctionConfig);
  if( adAuctionResult ) {
	  const frametype = 'iframe';
	  console.debug(`display ads in <${frametype}>`);
	  const $iframe = document.createElement(frametype);
	  $iframe.src = adAuctionResult;
	  $iframe.id = adAuctionID;
	  $iframe.setAttribute('scrolling','no')
	  $iframe.style = 'border:2px dotted black; width:100px; height:100px';
		if (frametype === 'fencedframe') {
	    $iframe.mode = 'opaque-ads';
	  }
	  document.body.appendChild($iframe);
 }
};
document.body.appendChild(b);
