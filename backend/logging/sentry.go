package logging

import (
	"fmt"

	"github.com/getsentry/sentry-go"
)

// Connect to Sentry
func Init(dsn string) {
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              dsn,
		TracesSampleRate: 1.0,
	}); err != nil {
		fmt.Printf("Sentry initialization failed: %v", err)
	}
}

// Capture exceptions and send to Sentry
func LogException(exception error) {
	sentry.CaptureException(exception)
}