package data

type User struct {
	ID int `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
	Role string `json:"role"`
}
