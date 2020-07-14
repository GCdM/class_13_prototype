class Admin::DashboardController < ApplicationController
    before_action :authorised?
    
    def dashboard
        @answers = Answer.completed
    end

    private

    def authorised?
        redirect_to unauthorised_path unless false || session[:admin]
    end
end
