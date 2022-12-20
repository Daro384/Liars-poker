class User < ApplicationRecord
    has_secure_password
    validates :username, presence: true
    validates :rating, presence: true
end
