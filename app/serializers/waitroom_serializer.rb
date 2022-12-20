class WaitroomSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :rating, :invite, :inGame
end
