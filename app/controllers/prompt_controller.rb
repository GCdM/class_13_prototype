class PromptController < ApplicationController

    def entry

    end

    def answer

    end

    def upload
        participant = Participant.first
        prompt = Prompt.first
        answer = Answer.create(participant: participant, prompt: prompt)
        answer.audio.attach(params[:audio])
        # audio_binary = answer.audio.download
        
        render json: { audioUrl: url_for(answer.audio) }
        # redirect_to dashboard_path
    end

    def dashboard
        @answers = Answer.all
    end
end
