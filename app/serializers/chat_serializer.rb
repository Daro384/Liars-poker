class ChatSerializer < ActiveModel::Serializer
  attributes :id, :message, :user_id, :game_id
end
