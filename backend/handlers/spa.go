package handlers

import (
	"net/http"
	"os"
	"path/filepath"
)

func SpaHandler(w http.ResponseWriter, r *http.Request) {
	// Get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	path = filepath.Join(".", "web", path)

	// Check if request is for a file that exists
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// File does not exist, server index.html
		http.ServeFile(w, r, filepath.Join(".", "web", "index.html"))
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// use FileServer to return the requested asset
	http.FileServer(http.Dir(filepath.Join(".", "web"))).ServeHTTP(w, r)
}
