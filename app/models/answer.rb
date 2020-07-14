class Answer < ApplicationRecord
    belongs_to :prompt
    belongs_to :participant
    has_one_attached :audio

    def self.completed
        self.all.filter { |answer| answer.audio.attached? }
    end
end
