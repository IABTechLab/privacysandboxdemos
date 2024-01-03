const auctionConfig = {
  seller: seller,

  decisionLogicUrl: `${seller}/ssp/decision-logic.js`,

  interestGroupBuyers: [
    buyer,
  ],

  trustedScoringSignalsUrl: `${seller}/ssp/kv.json`,

  auctionSignals: { auction_signals: 'auction_signals' },

  sellerSignals: { seller_signals: 'seller_signals' },

  perBuyerSignals: {
    [`${buyer}`]: {
      per_buyer_signals: 'per_buyer_signals',
    },
  },
};
var auctionSlot;
var adUnitCode;
adUnitCode = "/62650033/privacy-sandbox-adunit";

window.googletag = window.googletag || { cmd: [] };
window.googletag.cmd.push(function () {
  auctionSlot = window.googletag
      .defineUnit(
          adUnitCode,
          [300,250],
          "fledge-iframe"
      )
      .addService(window.googletag.pubads()).setTargeting("privacy-sandbox", "1");

  auctionSlot.setConfig({
    componentAuction: [
      {
        configKey: seller,
        auctionConfig: auctionConfig,
      },
    ],
  });

  window.googletag.pubads().enableSingleRequest();
  window.googletag.pubads().disableInitialLoad();
  window.googletag.enableServices();
});
googletag.cmd.push(function() {
  googletag.pubads().addEventListener('slotRenderEnded',
      (event) => {
        const slot = event.slot;
        console.group(
            'Slot', slot.getSlotElementId(), 'finished rendering.');
      }
  );
  googletag.display('fledge-iframe');
});

document.addEventListener("DOMContentLoaded", async (e) => {
  if (!navigator.runAdAuction) {
    result.innerText =
        "runAdAuction doesn't exist. Please enable the flags at chrome://flags/#privacy-sandbox-ads-apis";
  }
});

function refreshSlot() {
  googletag.pubads().refresh([auctionSlot]);
}


