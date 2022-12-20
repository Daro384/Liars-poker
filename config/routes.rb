Rails.application.routes.draw do
  resources :plies
  resources :games
  resources :waitrooms
  resources :histories
  resources :users

  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"
  get "/me", to: "users#show"
  # get "/match_me", to: "waitrooms#match"


  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
