class User < ApplicationRecord
    has_secure_password
    validates :username, presence: true
    validates :username, uniqueness: {case_sensitive: false}
    validates :rating, presence: true
    validates :rating, numericality: {only_integer: true}
    validates :display_name, presence: true
    # validates :password, presence: true
end
