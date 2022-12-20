class GameSerializer < ActiveModel::Serializer
  attributes :id, :white_player_id, :black_player_id, :winner
end
