class MoveSerializer < ActiveModel::Serializer
  attributes :id, :game_id, :player_id, :hand
end
