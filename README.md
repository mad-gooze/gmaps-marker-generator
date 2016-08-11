# Custom Color GMaps v3 Marker Icons Generator [![marker](https://gmaps-marker-generator.cf/get-marker?scale=22x40)](https://gmaps-marker-generator.cf)
[![Build Status](https://travis-ci.org/MAD-GooZe/gmaps-marker-generator.svg?branch=master)](https://travis-ci.org/MAD-GooZe/gmaps-marker-generator)
[![bitHound Overall Score](https://www.bithound.io/github/MAD-GooZe/gmaps-marker-generator/badges/score.svg)](https://www.bithound.io/github/MAD-GooZe/gmaps-marker-generator)

[gmaps-marker-generator.cf/get-marker](https://gmaps-marker-generator.cf/get-marker) is a simple service 
which allows you to generate custom color marker icons 
which copy the design of standart Google Maps v3 marker.

## Usage

Grab your custom marker icon on this URL:

https://gmaps-marker-generator.cf/get-marker


### Parameters: 
* #### scale
    
    Supported values are:
    `22x40`, `44x80`, `66x120`, `88x160`
    
    Default: `88x160`
    
* #### color
    
    Supported value should be a color in any form processed by 
    [parse-color](https://www.npmjs.com/package/parse-color),
    for example hex (like `45f412`, `fff`), keyword (like `red`, `blue`) etc.
    
    **Note!** You can supply hex color values with `#` (like `#ff0000`), but `#` should be URL-encoded to `%23`

### Examples

Marker icon | URL
:---:|---
![marker](https://gmaps-marker-generator.cf/get-marker?color=ff0000&scale=44x80)|https://gmaps-marker-generator.cf/get-marker?color=0f0&scale=44x80
![marker](https://gmaps-marker-generator.cf/get-marker?color=ffa500&scale=44x80)|https://gmaps-marker-generator.cf/get-marker?color=ffa500&scale=44x80
![marker](https://gmaps-marker-generator.cf/get-marker?color=blue&scale=44x80)|https://gmaps-marker-generator.cf/get-marker?color=blue
![marker](https://gmaps-marker-generator.cf/get-marker?color=yellow&scale=44x80)|https://gmaps-marker-generator.cf/get-marker?color=yellow&scale=44x80
