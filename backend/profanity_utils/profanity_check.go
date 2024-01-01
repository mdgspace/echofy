package profanityutils

import (
	customutils "bot/customUtils"

	goaway "github.com/TwiN/go-away"
)

var profanityDetector goaway.ProfanityDetector
var falsePositives []string
var falseNegatives []string

func InitProfanityDetector() {
	profanityDetector = *goaway.NewProfanityDetector()
	falsePositives = goaway.DefaultFalsePositives
	falseNegatives = goaway.DefaultFalseNegatives
}

func IsMsgProfane(msg string) bool {
	return profanityDetector.IsProfane(msg)
}

func GetProfanePartOfMsg(msg string) string {
	return profanityDetector.ExtractProfanity(msg)
}

func RemoveProfane(word string) string {
	for _, profanity := range falseNegatives {
		if profanity == word {
			customutils.RemoveElementFromSlice[string](falseNegatives, profanity)
		}
	}
	for _, profanity := range falsePositives {
		if profanity == word {
			return word + " is already whitelisted"
		}
	}
	falsePositives = append(falsePositives, word)
	profanityDetector = *goaway.NewProfanityDetector().WithCustomDictionary(goaway.DefaultProfanities, falsePositives, falseNegatives)
	return word + " is whitelisted successfully"
}

func AddProfane(word string) string {
	for _, profanity := range falseNegatives {
		if profanity == word {
			return word + " is already blacklisted"
		}
	}
	for _, profanity := range falsePositives {
		if profanity == word {
			falsePositives = customutils.RemoveElementFromSlice[string](falsePositives, profanity)
			break
		}
	}
	falseNegatives = append(falseNegatives, word)
	profanityDetector = *goaway.NewProfanityDetector().WithCustomDictionary(goaway.DefaultProfanities, falsePositives, goaway.DefaultFalseNegatives)
	return word + " is blacklisted successfully"
}
