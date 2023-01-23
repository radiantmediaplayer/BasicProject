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

The demo app is built with a landing page (index.html) that offers the possibility to start different players showcasing various features available with Radiant Media Player for Samsung Smart TV.

Players displayed use our dedicated TV player layout for a better fullscreen experience on large displays.

This demo app has been built to support Basic Device and Smart Control 2016 remotes.

## Important support notes

- You may want to review the config.xml file to allow common privileges for video apps for Tizen TV
- We support streaming to Samsung Smart TV in MPEG-DASH or CMAF HLS (HLS in MPEG-TS format is not supported)
- Google IMA (video ads) is not currently supported, please use our rmp-vast parser to display video ads on Samsung Smart TV

## Issues

Issues for this demo app should be submitted in this GitHub page. We will do our best to review them. If you are a Radiant Media Player customer and need support with our player please [open a ticket here](https://www.radiantmediaplayer.com/technical-support.html).

## License for BasicProject

BasicProject is released under MIT.

## License for Radiant Media Player

Radiant Media Player is a commercial HTML5 media player, not covered by the above MIT license.

Radiant Media Player license can be found here: [https://www.radiantmediaplayer.com/terms-of-service.html](https://www.radiantmediaplayer.com/terms-of-service.html).

You may request a free trial for Radiant Media Player at: [https://www.radiantmediaplayer.com/free-trial.html](https://www.radiantmediaplayer.com/free-trial.html).
