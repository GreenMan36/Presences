const presence = new Presence({
		clientId: "1106990410838065172",
	}),
	slideshow = presence.createSlideshow(),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const assets = {
			PhindLogo: "https://i.imgur.com/fakWcYA.png",
			Search: Assets.Search,
		},
		presenceData: PresenceData = {
			largeImageKey: assets.PhindLogo,
			details: "Browsing Phind",
		},
		pathDetailsMap = {
			"/filters": "Viewing Filters",
			"/default": "Viewing how to set Phind as default",
			"/bangs": "Viewing !Bangs",
			"/mobile": "Viewing Mobile Page",
			"/hotkeys": "Viewing Hotkeys",
			"/history": "Viewing Search History",
			"/about": "Viewing About Page",
			"/tutorial": "Viewing Tutorial",
			"/privacy": "Viewing Privacy Policy",
			"/terms": "Viewing Terms",
		},
		{ pathname, href } = document.location,
		pathDetails = Object.entries(pathDetailsMap).find(([pathPrefix]) =>
			pathname.startsWith(pathPrefix)
		),
		searchResults = document.querySelectorAll("div.row[name^='answer-']"),
		[displayTime, displaySearch, cycleSearch, shareSearch, privateMode] =
			await Promise.all([
				presence.getSetting("displayTime"),
				presence.getSetting("displaySearch"),
				presence.getSetting("cycleSearch"),
				presence.getSetting("shareSearch"),
				presence.getSetting("privateMode"),
			]);

	if (displayTime) presenceData.startTimestamp = browsingTimestamp;

	if (pathDetails) {
		presenceData.details = pathDetails[1]; // display text of /path
		presenceData.state = pathname; // display /path
		slideshow.deleteAllSlides();
	} else if (searchResults.length > 0 && !privateMode) {
		// we must be on /search
		presenceData.details = displaySearch ? "Searching for:" : "Searching";
		presenceData.smallImageKey = assets.Search;
		presenceData.smallImageText = "Searching";
		if (shareSearch) {
			// cached result (exact same GPT output) : brand new search (different GPT output)
			presenceData.buttons = [
				{
					label: href.includes("?cache=")
						? "Open Search Result"
						: "Open Search",
					url: href,
				},
			];
		}

		if (displaySearch && cycleSearch && searchResults.length > 1) {
			for (const [i, result] of searchResults.entries()) {
				const newPresenceData: PresenceData = { ...presenceData };
				newPresenceData.state = `${i + 1}. ${
					result.querySelector("span.fw-bold.fs-3.mb-3").textContent
				}`;
				slideshow.addSlide(i.toString(), newPresenceData, 5000);
			}
		} else if (displaySearch) {
			presenceData.state = searchResults[0].querySelector(
				"span.fw-bold.fs-3.mb-3"
			).textContent;
		}
		if (!cycleSearch) slideshow.deleteAllSlides();
	}

	if (privateMode) {
		// hide everything except the large image and site name
		presenceData.details = "Browsing Phind";
		delete presenceData.state;
		delete presenceData.smallImageKey;
		delete presenceData.smallImageText;
		delete presenceData.buttons;
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
		slideshow.deleteAllSlides();
	}
	if (!cycleSearch || !displaySearch) slideshow.deleteAllSlides();
	if (slideshow.getSlides().length > 1) presence.setActivity(slideshow);
	else presence.setActivity(presenceData);
});
