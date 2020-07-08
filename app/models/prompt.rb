class Prompt < ApplicationRecord
    has_many :answers
    has_many :participants, through: :answers
end
