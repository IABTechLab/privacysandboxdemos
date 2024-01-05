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

var b = document.getElementById("run");
var target = document.getElementById("ad")


b.onclick = async () => {

  console.log("Runnning auction");
  var old = document.getElementById(adAuctionID);


  var adSlotDesc = document.createElement("div");

  const adAuctionResult = await navigator.runAdAuction(auctionConfig);
  if (adAuctionResult) {
    const frametype = 'iframe';
    console.debug(`display ads in <${frametype}>`);
    const $iframe = document.createElement(frametype);
    $iframe.src = adAuctionResult;
    $iframe.id = adAuctionID;
    $iframe.setAttribute('scrolling', 'no')
    $iframe.style = 'width:300px; height:250px';
    if (frametype === 'fencedframe') {
      $iframe.mode = 'opaque-ads';
    }
    old.replaceWith($iframe);
    //target.appendChild($iframe);
  } else {
    const adContainer = document.getElementById("ad-container");
    adContainer.innerHTML = '<div class="demo-ad-slot-area" id="fledge-iframe">300x250 <br><br><p style="color:red">no auction winner</p></div>';
  }    
};
