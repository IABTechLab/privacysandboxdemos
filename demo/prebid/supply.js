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
    sellerSignals: { floor: 7, auctionID: 'id_' + Math.round(Math.random() * 1000000 ) },
  
    // only for single party
    perBuyerSignals: {
      // listed on interestGroupByers
      [`${buyer}`]: {
        buyerdata: 'per_buyer_signals',
      },
    },
  };
  
  
  
  var adAuctionID = 'fledge-iframe';
  
  //var b = document.createElement('button');
  var b = document.getElementById("run");
  var target = document.getElementById("adSlot")

  b.onclick = async() => {
    console.log("Runnning auction");
    var old = document.getElementById(adAuctionID);
    old?.remove() ;
  
    var adSlotDesc = document.createElement("div");
    adSlotDesc.textContent="Running Auction";
    target.appendChild(adSlotDesc);
    
    target.appendChild()
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
        target.appendChild($iframe);
   }
  };
  
