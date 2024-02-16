package customutils

import (
	"bot/globals"
	"bot/logging"
	"fmt"
	"net"

	"github.com/ipinfo/go/v2/ipinfo"
)


func GetUserLocation(ip string) string {
	fmt.Println(ip)
	client := ipinfo.NewClient(nil, nil, globals.LocationToken)
	info, err := client.GetIPInfo(net.ParseIP(ip))
	if err != nil {
		logging.LogException(err)
		return ""
	}
	locationInfo := info.CountryName + ", " + info.Region + ", " + info.City +  ", " + info.Location
	return locationInfo
}
