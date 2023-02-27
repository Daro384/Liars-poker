class GameSerializer < ActiveModel::Serializer
  attributes :id, :lobby_name, :ongoing, :rng_hash, :host_id
  has_many :players
  has_many :moves
end
