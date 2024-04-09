package models

type ProjectCategory string

const (
	Events   ProjectCategory = "Events"
	Projects ProjectCategory = "Projects"
)

type Project struct {
	Name      string
	Category  ProjectCategory
	ShortDesc string
	LongDesc  string
	ImageLink string
	AppStoreLink string
	GithubLink string
	PlayStoreLink string
}
