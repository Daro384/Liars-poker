class HostSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :lobby_name, :rng_seed
  has_many :participants
end
