class Answer < ApplicationRecord
  belongs_to :prompt
  belongs_to :participant
  has_one_attached :audio
end
