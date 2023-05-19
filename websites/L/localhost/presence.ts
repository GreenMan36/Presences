const presence = new Presence({
		clientId: "1109072021272412270",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

enum Assets {
	defaultLargeImage = "https://i.imgur.com/S5Bh7Qt.png",
	activityWatch = "https://avatars.githubusercontent.com/u/18249061",
	frameworkReact = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
	frameworkVue = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/512px-Vue.js_Logo_2.svg.png",
	frameworkNext = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/512px-Nextjs-logo.svg.png",
	frameworkAngular = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/512px-Angular_full_color_logo.svg.png",
	frameworkSvelte = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/512px-Svelte_Logo.svg.png",
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.defaultLargeImage,
			details: "Browsing",
			state: "Error: Could not find path",
			startTimestamp: browsingTimestamp,
		},
		{ href } = document.location,
		title = document.querySelector("title")?.textContent;

	presenceData.details = title;
	presenceData.state = `Viewing ${href.substring(
		href.indexOf("/", href.indexOf("//") + 2)
	)}`;

	function findFramework(): string {
		const scripts = document.querySelectorAll("script"),
			links = document.querySelectorAll("link");

		for (const script of scripts) {
			const src = script.getAttribute("src");
			// react: src="/static/js/bundle.js"
			if (src && src.includes("bundle.js")) return "React";
			// next: src="/_next/*"
			if (src && src.includes("_next")) return "Next";
		}

		for (const link of links) {
			const href = link.getAttribute("href");
			// sveltekit: href="./_app/immutable/*"
			if (href && href.includes("_app/immutable/")) return "SvelteKit";
		}
		// Find classes named svelte-*
		if (document.querySelector("[class^='svelte-']")) return "Svelte";
		// Find Angular (I hate it)
		if (
			document.querySelector(".ng-version") ||
			document.querySelector(".ng-scope") ||
			document.querySelector("[ng-app]") ||
			document.querySelector("[ng-controller]") ||
			document.querySelector("[ng-repeat]")
		)
			return "Angular";

		return "unknown";
	}

	const framework = findFramework();

	if (framework !== "unknown") {
		// get the asset for the framework, can be vue, react or other but it is frameworkName
		presenceData.smallImageKey =
			Assets[`framework${framework}` as keyof typeof Assets];
		presenceData.smallImageText = framework;
	}

	if (title === "ActivityWatch")
		presenceData.largeImageKey = Assets.activityWatch;

	console.log(framework);
	presence.setActivity(presenceData);
});
