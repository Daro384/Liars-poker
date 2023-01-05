class GameSerializer < ActiveModel::Serializer
  attributes :id, :white_player_id, :black_player_id, :winner, :ongoing, :latest_position, :end_cause, :time, :increment_time
  has_many :plies
  has_many :chats
end
