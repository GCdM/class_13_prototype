class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true

    def self.encoded_find(encoded_id)
        decoded_id = Base64.urlsafe_decode64(encoded_id)
        self.find(decoded_id)
    end

    def encoded_id
        Base64.urlsafe_encode64(self.id.to_s, padding: false)
    end
end
