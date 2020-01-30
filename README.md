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
The demo app is built with a landing page (index.html) that offers the possibility to start 4 different players showcasing various features available with Radiant Media Player for Samsung Smart TV:
- mp4.html (MP4 progressive download streaming)
- live.html (DASH live player)
- drm.html (DASH DRM)
- ads.html (DASH with video ads)

Players displayed use our dedicated TV player layout for a better fullscreen experience on large displays.

This demo app has been built to support Basic Device and Smart Control 2016 remotes and tested on a Tizen 4 2018 Samsung Smart TV.

## Issues
Issues should be submitted in this GitHub page. We will do our best to review them.

## License
BasicProject is released under MIT

Radiant Media Player has its own license which can be found here: [https://www.radiantmediaplayer.com/terms-of-service.html](https://www.radiantmediaplayer.com/terms-of-service.html)
