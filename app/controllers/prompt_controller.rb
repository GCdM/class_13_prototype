class PromptController < ApplicationController

    def entry
        @prompt = Prompt.encoded_find(params[:encoded_prompt_id])
        @participant = Participant.encoded_find(params[:encoded_participant_id])
        @answer = Answer.find_or_create_by(prompt: @prompt, participant: @participant)
        byebug
        if @answer.audio.attached?
            render :already_answered
        else
            render :entry
        end
    end

    def answer
        @answer = Answer.encoded_find(params[:encoded_id])
        @prompt = @answer.prompt
    end

    def upload
        participant = Participant.first
        prompt = Prompt.first
        answer = Answer.create(participant: participant, prompt: prompt)
        answer.audio.attach(params[:audio])
        
        render json: { audioUrl: url_for(answer.audio) }
    end

    def dashboard
        @answers = Answer.all
    end
end
