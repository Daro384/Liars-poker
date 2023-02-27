class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :game_id, :player_id, :display_name
end
