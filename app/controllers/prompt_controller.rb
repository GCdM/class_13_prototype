class PromptController < ApplicationController

    def entry
        @prompt = Prompt.find(params[:prompt_id])
        @participant = Participant.find(params[:id])
        @answer = Answer.find_or_create_by(prompt: @prompt, participant: @participant)

        if @answer.audio.attached?
            render :already_answered
        else
            render :entry
        end
    end

    def answer
        @answer = Answer.find(params[:id])
        @prompt = @answer.prompt
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
