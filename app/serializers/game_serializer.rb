class GameSerializer < ActiveModel::Serializer
  attributes :id, :lobby_name, :ongoing, :rng_hash, :host_id, :loser
  has_many :players
  has_many :moves
end
