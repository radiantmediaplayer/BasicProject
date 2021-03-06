# BasicProject

Example for using [Radiant Media Player](https://www.radiantmediaplayer.com) in a web-based Tizen TV app (Samsung smart TV).

## Usage

You can use Radiant Media Player to build media-oriented web-based Samsung Smart TV applications.
The player is equipped with various optimisations, notably file:// protocol support, to work in the following environments:

- Web applications for smart TV built with Tizen Studio
- Targeting deployment on Samsung Smart TV 2017+ models (Tizen 3+)

To get started with your first Tizen TV Web Application [follow that guide](https://docs.tizen.org/application/web/get-started/tv/first-app).

For a list of supported features [see our documentation](https://www.radiantmediaplayer.com/docs/latest/smart-tv.html#tv-app-supported-features).

## Demo app structure

The demo app is built with a landing page (index.html) that offers the possibility to start different players showcasing various features available with Radiant Media Player for Samsung Smart TV:

- mp4.html: MP4 progressive download streaming
- dash-vod.html: DASH VOD AVC
- dash-vod-multiple-audio.html: DASH multi-audio VOD
- dash-vod-hevc.html: DASH VOD HEVC
- dash-live.html: DASH Live AVC
- dash-drm-3.html: DASH DRM Angel One no_auth (Widevine)
- dash-drm-4.html: DASH DRM - 8 Byte IV (Verizon - Widevine)
- dash-drm-6.html: DASH Widevine Big Buck Bunny (Azure)
- dash-rmp-vast-ads.html: DASH VOD with video ads (rmp-vast)
- hls-vod.html: HLS VOD AVC
- checkenv.html (use for troubleshooting)

Players displayed use our dedicated TV player layout for a better fullscreen experience on large displays.

This demo app has been built to support Basic Device and Smart Control 2016 remotes and tested on Tizen 4 (2018) and Tizen 6 (2021) Samsung Smart TVs.

## Important support notes

- You may want to review the config.xml file to allow common privileges for video apps for Tizen TV
- 4K (UHD) content may cause content to fail at playing on some Tizen TV versions, especially if coupled with DRM 
- Google IMA (video ads) is not currently supported, please use our rmp-vast parser to display video ads on Samsung Smart TV

## Example

A live example of our demo app [can be viewed here](https://www.radiantmediaplayer.com/smarttv/). This example
is meant to be tested in web browsers (including Samsung Internet for Tizen 3+). When testing in a real web app for Tizen TV make sure to use your PLATFORM Edition license key and to deploy on an actual device through Tizen studio (emulator may not provide all available features).

## Issues

Issues should be submitted in this GitHub page. We will do our best to review them.

## License for BasicProject

BasicProject is released under MIT.

## License for Radiant Media Player

Radiant Media Player is a commercial HTML5 media player, not covered by the above MIT license.

Radiant Media Player license can be found here: [https://www.radiantmediaplayer.com/terms-of-service.html](https://www.radiantmediaplayer.com/terms-of-service.html).

You may request a free trial for Radiant Media Player at: [https://www.radiantmediaplayer.com/free-trial.html](https://www.radiantmediaplayer.com/free-trial.html).
