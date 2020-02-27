var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "463097721130188830",
    mediaKeys: false
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    live: "presence.activity.live"
});
var pattern = "•";
function truncateAfter(str, pattern) {
    return str.slice(0, str.indexOf(pattern));
}
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    var video = document.querySelector(".video-stream");
    if (video !== null && !isNaN(video.duration)) {
        var oldYouTube = null, YouTubeTV = null, YouTubeEmbed = null, title;
        document.querySelector(".watch-title") !== null
            ? (oldYouTube = true)
            : (oldYouTube = false);
        document.querySelector(".player-video-title") !== null
            ? (YouTubeTV = true)
            : (YouTubeTV = false);
        document.location.pathname.includes("/embed")
            ? (YouTubeEmbed = true)
            : (YouTubeEmbed = false);
        YouTubeEmbed
            ? (title = document.querySelector("div.ytp-title-text > a"))
            : oldYouTube && document.location.pathname.includes("/watch")
                ? (title = document.querySelector(".watch-title"))
                : YouTubeTV
                    ? (title = document.querySelector(".player-video-title"))
                    : !document.location.pathname.includes("/watch")
                        ? (title = document.querySelector(".ytd-miniplayer .title"))
                        : (title = document.querySelector("h1 yt-formatted-string.ytd-video-primary-info-renderer"));
        var uploaderTV, uploaderMiniPlayer, uploader2, edited, uploaderEmbed;
        (edited = false),
            (uploaderTV =
                document.querySelector(".player-video-details") ||
                    document.querySelector("ytd-video-owner-renderer  .ytd-channel-name")),
            (uploaderEmbed = document.querySelector("div.ytp-title-expanded-heading > h2 > a")),
            (uploaderMiniPlayer = document.querySelector("yt-formatted-string#owner-name")),
            (uploader2 = document.querySelector("#owner-name a"));
        if (uploaderMiniPlayer != null &&
            uploaderMiniPlayer.textContent == "YouTube") {
            edited = true;
            uploaderMiniPlayer.setAttribute("premid-value", "Listening to a playlist");
        }
        var uploader = uploaderMiniPlayer !== null && uploaderMiniPlayer.textContent.length > 0
            ? uploaderMiniPlayer
            : uploader2 !== null && uploader2.textContent.length > 0
                ? uploader2
                : document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a") !== null
                    ? document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a")
                    : uploaderEmbed !== null &&
                        YouTubeEmbed &&
                        uploaderEmbed.textContent.length > 0
                        ? uploaderEmbed
                        : (uploaderTV = truncateAfter(uploaderTV.textContent.replace(/\s+/g, ""), pattern));
        var timestamps = getTimestamps(Math.floor(video.currentTime), Math.floor(video.duration));
        var live = Boolean(document.querySelector(".ytp-live")), ads = Boolean(document.querySelector(".ytp-ad-player-overlay"));
        var presenceData = {
            details: title == null || title.textContent.replace(/\s+/g, "") == ""
                ? document.querySelector("div.ytp-title-text > a").textContent
                : title.textContent,
            state: edited == true
                ? uploaderMiniPlayer.getAttribute("premid-value")
                : uploaderTV !== null
                    ? uploaderTV.textContent
                    : uploader.textContent,
            largeImageKey: "yt_lg",
            smallImageKey: video.paused ? "pause" : "play",
            smallImageText: video.paused
                ? (yield strings).pause
                : (yield strings).play,
            startTimestamp: timestamps[0],
            endTimestamp: timestamps[1]
        };
        presence.setTrayTitle(video.paused
            ? ""
            : title == null
                ? document.querySelector(".title.style-scope.ytd-video-primary-info-renderer").textContent
                : title.textContent);
        if (video.paused || live) {
            delete presenceData.startTimestamp;
            delete presenceData.endTimestamp;
            if (live) {
                presenceData.smallImageKey = "live";
                presenceData.smallImageText = (yield strings).live;
            }
        }
        if (title == null &&
            document.querySelector(".title.style-scope.ytd-video-primary-info-renderer") !== null) {
            presenceData.details = document.querySelector(".title.style-scope.ytd-video-primary-info-renderer").textContent;
        }
        if (uploader == null &&
            document.querySelector(".style-scope.ytd-channel-name > a") !== null) {
            presenceData.state = document.querySelector(".style-scope.ytd-channel-name > a").textContent;
        }
        if (ads) {
            presenceData.details = "Currently watching an ad";
            delete presenceData.state;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
    else if (document.location.hostname == "www.youtube.com" ||
        document.location.hostname == "youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/results")) {
            search = document.querySelector("#search-input > div > div:nth-child(2) > input");
            if (search == null) {
                search = document.querySelector("#search-input > input");
            }
            presenceData.details = "Searching for:";
            presenceData.state = search.value;
            presenceData.smallImageKey = "search";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel") ||
            document.location.pathname.includes("/user")) {
            if (document.querySelector("#text.ytd-channel-name") &&
                document.title
                    .substr(0, document.title.lastIndexOf(" - YouTube"))
                    .includes(document.querySelector("#text.ytd-channel-name").textContent)) {
                user = document.querySelector("#text.ytd-channel-name").textContent;
            }
            else if (/\(([^)]+)\)/.test(document.title.substr(0, document.title.lastIndexOf(" - YouTube")))) {
                user = document.title
                    .substr(0, document.title.lastIndexOf(" - YouTube"))
                    .replace(/\(([^)]+)\)/, "");
            }
            else {
                user = document.title.substr(0, document.title.lastIndexOf(" - YouTube"));
            }
            if (user.replace(/\s+/g, "") == "" || user.replace(/\s+/g, "") == "‌")
                user = "null";
            if (document.location.pathname.includes("/videos")) {
                presenceData.details = "Browsing through videos";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/playlists")) {
                presenceData.details = "Browsing through playlists";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/community")) {
                presenceData.details = "Viewing community posts";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/about")) {
                presenceData.details = "Reading about channel:";
                presenceData.state = user;
                presenceData.smallImageKey = "reading";
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/search")) {
                search = document.URL.split("search?query=")[1];
                presenceData.details = "Searching through channel: " + user;
                presenceData.state = "for: " + search;
                presenceData.smallImageKey = "search";
                presenceData.startTimestamp = browsingStamp;
            }
            else {
                presenceData.details = "Viewing channel:";
                presenceData.state = user;
                presenceData.startTimestamp = browsingStamp;
            }
        }
        else if (document.location.pathname.includes("/feed/trending")) {
            presenceData.details = "Viewing what's trending";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/subscriptions")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their subscriptions";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/library")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their library";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/history")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/purchases")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their purchases";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/playlist")) {
            presenceData.details = "Viewing playlist:";
            title = document.querySelector("#text-displayed");
            if (title == null) {
                title = document.querySelector("#title > yt-formatted-string > a");
            }
            presenceData.state = title.textContent;
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/premium")) {
            presenceData.details = "Reading about";
            presenceData.state = "Youtube Premium";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/gaming")) {
            presenceData.details = "Browsing through";
            presenceData.state = "Youtube Gaming";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/account")) {
            presenceData.details = "Viewing their account";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/reporthistory")) {
            presenceData.details = "Viewing their report history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/intl")) {
            presenceData.details = "Reading about:";
            presenceData.state = document.title.substr(0, document.title.lastIndexOf(" - YouTube"));
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.URL == "https://www.youtube.com/") {
            presenceData.details = "Browsing the main page...";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/upload")) {
            presenceData.details = "Uploading something...";
            presenceData.startTimestamp = browsingStamp;
            presenceData.smallImageKey = "writing";
        }
        else if (document.location.pathname.includes("/view_all_playlists")) {
            presenceData.details = "Viewing all their playlists";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/my_live_events")) {
            presenceData.details = "Viewing their live events";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/live_dashboard")) {
            presenceData.details = "Viewing their live dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/audiolibrary")) {
            presenceData.details = "Viewing the audio library";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
    else if (document.location.hostname == "studio.youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg",
            smallImageKey: "studio",
            smallImageText: "Youtube Studio"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/videos")) {
            presenceData.details = "Viewing their videos";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/video")) {
            title = document.querySelector("#entity-name");
            presenceData.startTimestamp = browsingStamp;
            if (document.location.pathname.includes("/edit")) {
                presenceData.details = "Editing video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/analytics")) {
                presenceData.details = "Viewing analytics of video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/comments")) {
                presenceData.details = "Viewing comments of video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/translations")) {
                presenceData.details = "Viewing translations of video:";
                presenceData.state = title.textContent;
            }
        }
        else if (document.location.pathname.includes("/analytics")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel analytics";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/comments")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel comments";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/translations")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel translations";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel")) {
            presenceData.details = "Viewing their dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/artist")) {
            presenceData.details = "Viewing their";
            presenceData.state = "artist page";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
}));
function getTimestamps(videoTime, videoDuration) {
    var startTime = Date.now();
    var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
    return [Math.floor(startTime / 1000), endTime];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wcmVzZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztJQUN4QixRQUFRLEVBQUUsb0JBQW9CO0lBQzlCLFNBQVMsRUFBRSxLQUFLO0NBQ2pCLENBQUMsRUFDRixPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUM1QixJQUFJLEVBQUUsMkJBQTJCO0lBQ2pDLEtBQUssRUFBRSwwQkFBMEI7SUFDakMsSUFBSSxFQUFFLHdCQUF3QjtDQUMvQixDQUFDLENBQUM7QUFHTCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDbEIsU0FBUyxhQUFhLENBQUMsR0FBRyxFQUFFLE9BQU87SUFDakMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQVMsRUFBRTtJQUVuQyxJQUFJLEtBQUssR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN0RSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzVDLElBQUksVUFBVSxHQUFZLElBQUksRUFDNUIsU0FBUyxHQUFZLElBQUksRUFDekIsWUFBWSxHQUFZLElBQUksRUFDNUIsS0FBVSxDQUFDO1FBR2IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxJQUFJO1lBQzdDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRXpCLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFC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