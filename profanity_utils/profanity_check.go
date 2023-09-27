package profanityutils

import goaway "github.com/TwiN/go-away"

var profanityDetector goaway.ProfanityDetector
var falsePositives []string

func InitProfanityDetector() {
	profanityDetector = *goaway.NewProfanityDetector()
	falsePositives = goaway.DefaultFalsePositives
}

func IsMsgProfane(msg string) bool {
	return profanityDetector.IsProfane(msg)
}

func GetProfanePartOfMsg(msg string) string {
	return profanityDetector.ExtractProfanity(msg)
}

func RemoveProfane(word string) string {
	for _, profanity := range falsePositives {
		if profanity == word {
			return word + " is already whitelisted"
		}
	}
	falsePositives = append(falsePositives, word)
	profanityDetector = *goaway.NewProfanityDetector().WithCustomDictionary(goaway.DefaultProfanities, falsePositives, goaway.DefaultFalseNegatives)
	return word + " is whitelisted successfully"
}
