package customutils

// remove an element from a slice
func RemoveElementFromSlice[K comparable](slice []K, element K) []K {
	for index, sliceElement := range slice {
		if sliceElement == element {
			slice = append(slice[:index], slice[index+1:]...)
			break
		}
	}
	return slice
}
