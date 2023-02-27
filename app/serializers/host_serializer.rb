class HostSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :lobby_name
  has_many :participants
end
