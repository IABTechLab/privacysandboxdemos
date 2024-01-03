const auctionConfig = {
  seller: seller,

  decisionLogicUrl: `${seller}/ssp/decision-logic.js`,
  trustedScoringSignalsUrl: `${seller}/ssp/kv.json`,

  interestGroupBuyers: [
    // * is not supported yet
    buyer,
  ],
  // public for everyone
  auctionSignals: { auction_signals: 'auction_signals' },

  // only for single party
  sellerSignals: { floor: 7, auctionID: 'id_' + Math.round(Math.random() * 1000000) },

  // only for single party
  perBuyerSignals: {
    // listed on interestGroupByers
    [`${buyer}`]: {
      buyerdata: 'per_buyer_signals',
    },
  },
};



var adAuctionID = 'fledge-iframe';

var b = document.getElementById("run");
var target = document.getElementById("ad")


b.onclick = async () => {

    var pa = typeof navigator.runAdAuction !== 'undefined';
    if(!pa) {
      console.error("Please ensure that you're running this demo using a recent version of the Google Chrome browser.");
      return;
    }

  console.log("Runnning auction");
  var old = document.getElementById(adAuctionID);



    var dynamicAuctionConfig = structuredClone(auctionConfig);
    if( editor.getText() ) {
        const perBuyerSignals = editor.get();
          const keys = Object.keys(perBuyerSignals)

          keys.forEach((key) => {
            dynamicAuctionConfig.interestGroupBuyers.push(key);
            dynamicAuctionConfig.perBuyerSignals[key] = perBuyerSignals[key];
          });
    }

  const adAuctionResult = await navigator.runAdAuction(dynamicAuctionConfig);
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
  }
};
