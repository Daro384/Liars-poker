class Host < ApplicationRecord
    has_many :participants, dependent: :destroy
end
