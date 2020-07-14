Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/prompt/:encoded_prompt_id/:encoded_participant_id', to: 'prompt#entry', as: 'entry'

  get '/answer/:encoded_id', to: 'prompt#answer', as: 'answer'
  post '/answer', to: 'prompt#upload'

  get '/dashboard', to: 'prompt#dashboard', as: 'dashboard'
end
