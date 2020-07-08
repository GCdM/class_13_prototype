class Participant < ApplicationRecord
    has_many :answers
    has_many :prompts, through: :answers
end
