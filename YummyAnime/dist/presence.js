var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "639578071338582021",
    mediaKeys: false
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused"
});
var browsingStamp = Math.floor(Date.now() / 1000);
var title, views, air, air2;
var iFrameVideo, currentTime, duration, paused;
var video, videoDuration, videoCurrentTime;
var lastPlaybackState = null;
var playback;
var browsingStamp = Math.floor(Date.now() / 1000);
var user;
var search;
if (lastPlaybackState != playback) {
    lastPlaybackState = playback;
    browsingStamp = Math.floor(Date.now() / 1000);
}
presence.on("iFrameData", data => {
    playback =
        data.iframe_video.duration !== null
            ? true : false;
    if (playback) {
        iFrameVideo = data.iframe_video.iFrameVideo;
        currentTime = data.iframe_video.currTime;
        duration = data.iframe_video.dur;
        paused = data.iframe_video.paused;
    }
});
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    var a = '', timestamps = getTimestamps(Math.floor(currentTime), Math.floor(duration)), presenceData = {
        largeImageKey: "ya"
    };
    if (document.location.pathname.includes("/item")) {
        if (iFrameVideo == true && !isNaN(duration)) {
            presenceData.smallImageKey = paused ? "pause" : "play";
            presenceData.smallImageText = paused ? (yield strings).pause : (yield strings).play;
            presenceData.startTimestamp = timestamps[0];
            presenceData.endTimestamp = timestamps[1];
            title = document.querySelector("body > div.content-block.container.clearfix > div.content > div > h1");
            presenceData.details = title.innerText;
            air = document.querySelector("body > div.content-block.container.clearfix > div.content > div > ul.content-main-info > li:nth-child(3) > font > font");
            if (air !== null) {
                if (document.querySelector("body > div.web-app > div.home-bg > div > div > div.col-12.col-md-12.col-lg-9 > div > div > article > div > div:nth-child(1) > div.col-12.col-sm-6.col-lg-7 > div > div > table > tbody > tr:nth-child(5)") !== null) {
                    air = document.querySelector("body > div.web-app > div.home-bg > div > div > div.col-12.col-md-12.col-lg-9 > div > div > article > div > div:nth-child(1) > div.col-12.col-sm-6.col-lg-7 > div > div > table > tbody > tr:nth-child(5)");
                }
            }
            if (air !== null) {
                presenceData.state = "Aired on: " + air.innerText.replace("AIRED :", "");
            }
            if (paused) {
                delete presenceData.startTimestamp;
                delete presenceData.endTimestamp;
            }
        }
        else if (iFrameVideo == null && isNaN(duration)) {
            presenceData.startTimestamp = browsingStamp;
            presenceData.details = "Looking at: ";
            title = document.querySelector("body > div.content-block.container.clearfix > div.content > div > h1");
            presenceData.state = title.innerText;
            presenceData.smallImageKey = "reading";
        }
    }
    else if (document.location.pathname.includes("/movie")) {
        presenceData.details = "Browsing through";
        presenceData.state = "all movies";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/anime")) {
        presenceData.details = "Browsing through";
        presenceData.state = "all animes";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.URL.includes("/search")) {
        search = document.querySelector("body > div.content-block.container.clearfix > div.search-block-wrapper.main-search.clearfix > form > input.search");
        presenceData.details = "Searching for:";
        presenceData.state = search.value;
        presenceData.smallImageKey = "search";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/ongoing")) {
        presenceData.details = "Browsing through";
        presenceData.state = "ongoing animes";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/anime-updates")) {
        presenceData.details = "Browsing through";
        presenceData.state = "anime updates";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/post/")) {
        presenceData.details = "Reaing post:";
        title = document.querySelector("body > div.content-block.container.clearfix > div.content > div > div.post-title > font > font");
        if (title == null) {
            title = document.querySelector("body > div.content-block.container.clearfix > div.content > div > div.post-title");
        }
        presenceData.state = title.innerText;
        presenceData.smallImageKey = "reading";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/post")) {
        presenceData.details = "Viewing posts";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.location.pathname.includes("/top")) {
        presenceData.details = "Viewing the top";
        presenceData.startTimestamp = browsingStamp;
    }
    else if (document.URL == "https://otakustream.tv/") {
        presenceData.details = "Browsing...";
        presenceData.smallImageKey = "reading";
        presenceData.startTimestamp = browsingStamp;
    }
    if (presenceData.details == null) {
        presence.setTrayTitle();
        presence.setActivity();
    }
    else {
        presence.setActivity(presenceData);
    }
}));
function getTimestamps(videoTime, videoDuration) {
    var startTime = Date.now();
    var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
    return [Math.floor(startTime / 1000), endTime];
}
