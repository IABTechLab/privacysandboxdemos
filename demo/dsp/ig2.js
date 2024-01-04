const igName3 = 'bar';
const igName3External = 'hats';
const igOwner2 = buyer2;

const interestGroup3 = {
	name: igName3External,
	owner: igOwner2,

	biddingLogicUrl: `${igOwner2}//dsp/bidding-logic-2.js`,

	trustedBiddingSignalsUrl: `${igOwner2}//dsp/bidding_signal-2.json`,
	trustedBiddingSignalsKeys: ['arbitrary-key'],

	dailyUpdateUrl: `${igOwner2}//dsp/daily_update_url-${igName3}.json`,

	userBiddingSignals: { user_bidding_signals: 'user_bidding_signals' },
	ads: [
		{
			renderUrl: `${igOwner2}//advertiser/${igName3}-ad-1.html`,
			metadata: {
				type: igName3External,
				crid: `${igName3External}_ad_1_crid`,
				cid: `${igName3External}_ad_1_cid`,
				cat: ["IAB-1"],
				seat: `${igName3External}_ad_1_seat_id`,
				adomain: [`${igName3External}_ad_1_adomain.com`],
				w: 300,
				h: 250
			},		
		},
		{
			renderUrl: `${igOwner2}//advertiser/${igName3}-ad-2.html`,
			metadata: {
				type: igName3External,
				crid: `${igName3External}_ad_2_crid`,
				cid: `${igName3External}_ad_2_cid`,
				cat: ["IAB-2"],
				seat: `${igName3External}_ad_2_seat_id`,
				adomain: [`${igName3External}_ad_2_adomain.com`],
				w: 300,
				h: 250
			},		
		},
	],
};

function joinIG() {
	const kSecsPerDay = 3600 * 24 * 30;
	console.debug(navigator.joinAdInterestGroup(interestGroup3, kSecsPerDay));
	console.groupCollapsed( "%c PAAPI DSP2 %c joinInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", interestGroup3.name);
		console.log( 'owner: %s', interestGroup3.owner );
		console.log( 'name: %s', interestGroup3.name );
		console.log( 'bidding logic URL: %s', interestGroup3.biddingLogicUrl );
		console.log( 'number of ads: %d', interestGroup3.ads.length );
	console.groupEnd();
}

function leaveIG() {
	navigator.leaveAdInterestGroup({
		  owner: igOwner2,
		  name: igName3External
	});
	console.groupCollapsed( "%c PAAPI DSP2 %c leaveInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", igName3External);
	console.groupEnd();
}

var button = document.createElement('button');
button.innerHTML = "DSP2 - JOIN IG " + igName3External;
button.onclick = joinIG;
button.style = 'display:block';
document.body.appendChild(button);

var button2 = document.createElement('button');
button2.innerHTML = "DSP2 - LEAVE IG " + igName3External;
button2.onclick = leaveIG;
button2.style = 'display:block';
document.body.appendChild(button2);