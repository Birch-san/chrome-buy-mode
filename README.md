# Chrome Buy Mode

## Purpose

This Chrome extension gives you the power to play appropriate music when you go to websites.

In other words: you can choose a website's theme tune.

## Initial configuration

By default: the behaviour of this plugin is that it will play sweet royalty-free elevator music† when you navigate to [Birchlabs.co.uk](http://birchlabs.co.uk).

† From [BenSound](http://www.bensound.com/)

The config begins like this:

```json
{
	"rules": [
	{
		"match": [
	    "*://*.birchlabs.co.uk/*",
	    "*://birchlabs.co.uk/*"
		],
		"playlist":
		[
		'../../music/elevator.mp3'
		],
		"playlistMode": "noShuffle"
	}
	]
}
```

There is one rule configured in the `rules` array.

Upon navigating to any URL matching any pattern in the `match` array: Chrome Buy Mode will start playing its playlist.

`'../../music/elevator.mp3'` is a relative filepath that points to an mp3 bundled inside this extension.

To point to an mp3 on your computer, use something like:

- `'file:///Users/birch/Documents/some folder/coolsong.mp3'` (Mac)
- `'file:///C:/Documents%20and%20Settings/birch/coolsong.mp3'` (Windows)

For more examples, refer to:
- [File URIs in Windows](https://blogs.msdn.microsoft.com/ie/2006/12/06/file-uris-in-windows/)
- [File URI Scheme](https://en.wikipedia.org/wiki/File_URI_scheme)

__Remember to click "Save changes".__

## License

Chrome Buy Mode is licensed under *CC-BY-4.0* (Creative Commons Attribution 4.0 International Public License).

Elevator music bundled with this extension is sourced from [BenSound](http://www.bensound.com/), and is licensed under [Creative Commons Attribution-NoDerivs 3.0 Unported](http://www.bensound.com/licensing).