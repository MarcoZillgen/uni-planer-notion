package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/notion/data", getNotionData).Methods("GET")
	log.Println("Server is running on port 5432")
	log.Fatal(http.ListenAndServe(":5432", r))
}
