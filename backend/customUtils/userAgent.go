package customutils

import (
    "github.com/mileusna/useragent"
)


func GetBrowserAndOS(userAgent string) (browser, os string) {
	ua := useragent.Parse(userAgent)
	return ua.Name, ua.OS
}