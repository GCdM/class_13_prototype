Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/prompt/:prompt_id/:id', to: 'prompt#entry', as: 'entry'

  get '/answer/:id', to: 'prompt#answer', as: 'answer'
  post '/answer', to: 'prompt#upload'

  get '/dashboard', to: 'prompt#dashboard', as: 'dashboard'
end
