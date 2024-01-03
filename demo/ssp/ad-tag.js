const auctionConfig = {
  seller: seller,

  decisionLogicUrl: `${seller}/ssp/decision-logic.js`,
  trustedScoringSignalsUrl: `${seller}/ssp/kv.json`, 

  interestGroupBuyers: [
    buyer,
  ],
  auctionSignals: { auction_signals: 'auction_signals' },

  sellerSignals: { floor: 7, auctionID: 'id_' + Math.round(Math.random() * 1000000 ) },

  perBuyerSignals: {
    [`${buyer}`]: {
      buyerdata: 'per_buyer_signals',
    },
  },
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
