class ParticipantSerializer < ActiveModel::Serializer
  attributes :id, :host_id, :player_id, :display_name
end
