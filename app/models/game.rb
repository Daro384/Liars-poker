class Game < ApplicationRecord
    has_many :plies
    has_many :chats
end
