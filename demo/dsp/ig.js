


const igName = 'test';
const igNameExternal = 'shoes';
const igOwner = buyer1;

const interestGroup = {
	name: igNameExternal,
	owner: igOwner,

	biddingLogicUrl: `${igOwner}//dsp/bidding-logic.js`,

	trustedBiddingSignalsUrl: `${igOwner}//dsp/bidding_signal-1.json`,
	trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],

	dailyUpdateUrl: `${igOwner}//dsp/daily_update_url-${igName}.json`,
	userBiddingSignals: { user_bidding_signals: 'user_bidding_signals' },
	ads: [
		{
			renderUrl: `${igOwner}//advertiser/${igName}-ad-1.html`,
			metadata: {
				type: igNameExternal,
				crid: `${igNameExternal}_ad_1_crid`,
				cid: `${igNameExternal}_ad_1_cid`,
				cat: ["IAB-1"],
				seat: `${igNameExternal}_ad_1_seat_id`,
				adomain: [`${igNameExternal}_ad_1_adomain.com`],
				w: 300,
				h: 250
			},
		},
		{
			renderUrl: `${igOwner}//advertiser/${igName}-ad-2.html`,
			metadata: {
				type: igNameExternal,
				crid: `${igNameExternal}_ad_2_crid`,
				cid: `${igNameExternal}_ad_2_cid`,
				cat: ["IAB-2"],
				seat: `${igNameExternal}_ad_2_seat_id`,
				adomain: [`${igNameExternal}_ad_2_adomain.com`],
				w: 300,
				h: 250
			},
		},
	],
};
function joinIG1() {
	const kSecsPerDay = 3600 * 24 * 30;
	console.debug(navigator.joinAdInterestGroup(interestGroup, kSecsPerDay));

	console.groupCollapsed( "%c PAAPI DSP1 %c joinInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", interestGroup.name);
		console.log( 'owner: %s', interestGroup.owner );
		console.log( 'name: %s', interestGroup.name );
		console.log( 'bidding logic URL: %s', interestGroup.biddingLogicUrl );
		console.log( 'number of ads: %d', interestGroup.ads.length );
	console.groupEnd();
}

function leaveIG1() {
	navigator.leaveAdInterestGroup({
		  owner: igOwner,
		  name: igNameExternal
	});
	console.groupCollapsed( "%c PAAPI DSP1 %c leaveInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", igNameExternal);
	console.groupEnd();
}


var button = document.createElement('button');
button.innerHTML = "DSP1 - JOIN IG " + igNameExternal;
button.onclick = joinIG1;
button.style = 'display:block';
document.body.appendChild(button);

var button2 = document.createElement('button');
button2.innerHTML = "DSP1 - LEAVE IG " + igNameExternal;
button2.onclick = leaveIG1;
button2.style = 'display:block';
document.body.appendChild(button2);



const igName2 = 'foo';
const igName2External = 'books';
//console.log(igName2);

const interestGroup2 = {
	name: igName2External,
	owner: igOwner,

	// x-allow-fledge: true
	biddingLogicUrl: `${igOwner}//dsp/bidding-logic.js`,

	trustedBiddingSignalsUrl: `${igOwner}//dsp/bidding_signal-1.json`,
	trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],

	dailyUpdateUrl: `${igOwner}//dsp/daily_update_url-${igName}.json`,
	biddingLogicUrl: `${igOwner}//dsp/bidding-logic.js`,

	// x-allow-fledge: true
	dailyUpdateUrl: `${igOwner}//dsp/daily_update_url-${igName2}.json`,
	userBiddingSignals: { user_bidding_signals: 'user_bidding_signals' },
	ads: [
		{
			renderUrl: `${igOwner}//advertiser/${igName2}-ad-1.html`,
			metadata: {
				type: igNameExternal,
				crid: `${igName2External}_ad_1_crid`,
				cid: `${igName2External}_ad_1_cid`,
				cat: ["IAB-1"],
				seat: `${igName2External}_ad_1_seat_id`,
				adomain: [`${igName2External}_ad_1_adomain.com`],
				w: 300,
				h: 250
			},
		},
		{
			renderUrl: `${igOwner}//advertiser/${igName2}-ad-2.html`,
			metadata: {
				type: igNameExternal,
				crid: `${igName2External}_ad_2_crid`,
				cid: `${igName2External}_ad_2_cid`,
				cat: ["IAB-2"],
				seat: `${igName2External}_ad_2_seat_id`,
				adomain: [`${igName2External}_ad_2_adomain.com`],
				w: 300,
				h: 250
			},

		},
	],
};

function joinIG2() {
//	console.log(e);
	const kSecsPerDay = 3600 * 24 * 30;
	console.debug(navigator.joinAdInterestGroup(interestGroup2, kSecsPerDay));
	console.groupCollapsed( "%c PAAPI DSP1 %c joinInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", interestGroup2.name);
		console.log( 'owner: %s', interestGroup2.owner );
		console.log( 'name: %s', interestGroup2.name );
		console.log( 'bidding logic URL: %s', interestGroup2.biddingLogicUrl );
		console.log( 'number of ads: %d', interestGroup2.ads.length );
	console.groupEnd();
}

function leaveIG2() {
	navigator.leaveAdInterestGroup({
		  owner: igOwner,
		  name: igName2External
	});
	console.groupCollapsed( "%c PAAPI DSP1 %c leaveInterestGroup %c IG:%s", "color: green;  background-color:orange; border: 1px solid black", "color: purple; border:1px solid black", "", igName2External);
	console.groupEnd();
}

var button3 = document.createElement('button');
button3.innerHTML = "DSP1 - JOIN IG " + igName2External;
button3.onclick = joinIG2;
button3.style = 'display:block';
document.body.appendChild(button3);

var button4 = document.createElement('button');
button4.innerHTML = "DSP1 - LEAVE IG " + igName2External;
button4.onclick = leaveIG2;
button4.style = 'display:block';
document.body.appendChild(button4);
