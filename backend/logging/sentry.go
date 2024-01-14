package logging

import (
	"fmt"

	"github.com/getsentry/sentry-go"
)

var sentryInit bool = false

// Connect to Sentry
func Init(dsn string) {
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              dsn,
		TracesSampleRate: 1.0,
	}); err != nil {
		fmt.Printf("Sentry initialization failed: %v", err)
	} else {
		sentryInit = true
	}
}

// Capture exceptions and send to Sentry
func LogException(exception error) {
	if sentryInit {
		sentry.CaptureException(exception)
	}
}