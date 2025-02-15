package api

import (
	"solver/internal/api/middleware"
	"solver/internal/api/solver"

	"github.com/gorilla/mux"
)

func SetupRouter(s solver.Handler) *mux.Router {
	m := middleware.New(s.Solver)
	r := mux.NewRouter()
	r.Use(m.Json)

	protected := r.PathPrefix("").Subrouter()
	protected.Use(m.ApiKey)
	protected.HandleFunc("/solver/kill", s.GetKill).Methods("GET")
	protected.HandleFunc("/solver/kill", s.PostKill).Methods("POST")

	killable := protected.PathPrefix("").Subrouter()
	killable.Use(m.KillSwitch)
	killable.HandleFunc("/solver", s.GetSchema).Methods("GET")
	killable.HandleFunc("/solver", s.GetPlug).Methods("POST")

	return r
}
