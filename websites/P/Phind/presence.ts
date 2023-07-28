const presence = new Presence({
		clientId: "1106990410838065172",
	}),
	slideshow = presence.createSlideshow(),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	getPathDetails = (
		pathname: string
	): { details: string; state: string } | null => {
		const pathDetailsMap = {
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
				"/extension/activate": "Activating IDE Extension",
			},
			pathDetails = Object.entries(pathDetailsMap).find(([pathPrefix]) =>
				pathname.startsWith(pathPrefix)
			);

		return pathDetails ? { details: pathDetails[1], state: pathname } : null;
	};

presence.on("UpdateData", async () => {
	const assets = {
			PhindLogo: "https://i.imgur.com/fakWcYA.png",
			Search: Assets.Search,
		},
		presenceData: PresenceData = {
			largeImageKey: assets.PhindLogo,
			details: "Browsing Phind",
		},
		{ pathname, href } = document.location,
		searchResults = document.querySelectorAll("div.row[name^='answer-']"),
		[displayTime, displaySearch, cycleSearch, shareSearch, privateMode] =
			await Promise.all([
				presence.getSetting("displayTime"),
				presence.getSetting("displaySearch"),
				presence.getSetting("cycleSearch"),
				presence.getSetting("shareSearch"),
				presence.getSetting("privateMode"),
			]),
		pathDetails = getPathDetails(pathname);

	if (displayTime) presenceData.startTimestamp = browsingTimestamp;

	if (pathDetails) {
		presenceData.details = pathDetails.details;
		presenceData.state = pathDetails.state;
	} else if (
		(searchResults.length > 0 && pathname === "/agent") ||
		pathname === "/search"
	) {
		if (pathname === "/agent") {
			presenceData.details = "Using agent:";
			presenceData.smallImageText = "Using agent";
		} else if (pathname === "/search") {
			presenceData.details = "Searching for:";
			presenceData.smallImageText = "Searching";
		}
		presenceData.smallImageKey = assets.Search;

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

				if (pathname === "/agent") {
					newPresenceData.details = `${i + 1}. ${[
						...result.querySelectorAll("span.badge"),
					]
						.map(badge => badge.textContent)
						.join(", ")}`;
					newPresenceData.state = `${
						result.querySelector("div.row div.card-body .text-black")
							?.textContent
					}`;
				} else if (pathname === "/search") {
					newPresenceData.details = "Searching for:";
					newPresenceData.state = `${i + 1}. ${
						result.querySelector("span.fw-bold.fs-3.mb-3").textContent
					}`;
				}

				slideshow.addSlide(i.toString(), newPresenceData, 5000);
			}
		} else if (displaySearch && pathname === "/agent") {
			presenceData.state = searchResults[0].querySelector(
				"div.row div.card-body > div > div > p"
			).textContent;
		} else if (displaySearch && pathname === "/search") {
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
