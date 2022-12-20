class Waitroom < ApplicationRecord
    validates :rating, presence: true
    validates :player_id, presence: true
end
